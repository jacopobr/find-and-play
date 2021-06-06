from flask import Flask, render_template, url_for,request,redirect, jsonify, make_response,request, flash, session
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
from passlib.apps import custom_app_context as pwd_context
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename
from PIL import Image
from functools import wraps
from flask_cors import CORS
import base64
import pandas as pd
import random
import shutil
import datetime, time, os, jwt


app = Flask(__name__) #instantiate the class app

mysql = MySQL(cursorclass=DictCursor) #ritorno del cursore come dizionario, più facile da esportare in json
app.config['MYSQL_DATABASE_USER'] = 'findplay'
app.config['MYSQL_DATABASE_PASSWORD'] = 'findandplay'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_DB'] = 'FindPlay'
app.config['SECRET_KEY'] = '<secret_key>'
app.config['CONFIRMATION_KEY'] = '<secret_key>'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'findplaypolito@gmail.com'
app.config['MAIL_PASSWORD'] = app.config['SECRET_KEY']





mail = Mail(app)
cors = CORS(app, resorces={r'/api/': {"origins": '*'}})
mysql.init_app(app)#instantiate the mysql



#Funzione che controlla e verifica il token all'interno del json di richiesta
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401
        try: 
            data = jwt.decode(token, app.config['SECRET_KEY'],algorithms="HS256")
        except:
            return jsonify({'message' : 'Token is invalid'}), 401
        return f(*args, **kwargs) #aggiungere current_user se voglio restituire l'id dell'utente che è entrato
    return decorated

#API TO FETCH ALL THE PLAYGROUNDS LIST
@app.route("/api/playgrounds/", methods = ['GET'])
def get_all_playgrounds():
    conn = mysql.connect()
    cursor =conn.cursor()
    cursor.execute("SELECT * FROM Playground")
    results = cursor.fetchall()
    conn.close()
    return jsonify(results)

#API TO FETCH ALL THE PLAYGROUNDS EQUIPMENT LIST
@app.route("/api/playground/equipment/<code_pg>", methods = ['GET'])
def get_equipment(code_pg):
    conn = mysql.connect()
    cursor =conn.cursor()
    cursor.execute("SELECT * FROM Equipment where code_pg = %s", code_pg)
    results = cursor.fetchall()
    conn.close()
    return jsonify(results)



#Insert review of a playground, if it exists may have problems with the database, no duplicate key
#QUESTA ROUTE DOVREBBE ESSERE AUTORIZZATA SOLO PER GLI UTENTI REGISTRATI
@app.route("/api/review/", methods = ['POST'])
@token_required
def publish_review():
    conn = mysql.connect()
    review = request.get_json()
    code_pg = review['code_pg']
    user_id = review['user_id']
    score = review['score']
    content = review['content']
    try:
        cursor = conn.cursor()
        sql = "SELECT * FROM Review where code_pg = %s and user_id = %s"
        cursor.execute(sql,(code_pg,user_id))
        data = cursor.fetchone() #check if a review already exists
        if (data == None): 
            sql = "INSERT INTO Review (code_pg,user_id,score,content) VALUES (%s, %s,%s,%s)"
            cursor.execute(sql,(code_pg,user_id,score,content))
            conn.commit()
            return jsonify ({"message":"review inserted"})
        else:
            cursor = conn.cursor()
            sql = "DELETE FROM Review where code_pg = %s and user_id = %s"
            cursor.execute(sql,(code_pg,user_id))
            conn.commit()
            sql = "INSERT INTO review (code_pg,user_id,score,content) VALUES (%s, %s,%s,%s)"
            cursor.execute(sql,(code_pg,user_id,score,content))
            conn.commit()
            conn.close()
            return jsonify ({"message":"review inserted"})

    except Exception as e:
        #A volte l'inserimento non va a buon fine perchè è già presente una recensione di quel parco e di quell'utente
        print("Problem inserting into db: " + str(e))
        return jsonify({"message":"review not inserted" + str(e)})

#delete review of a playground
@app.route("/api/review/", methods = ['DELETE'])
@token_required
def delete_review():
    conn = mysql.connect()
    review = request.get_json()
    code_pg = review['code_pg']
    user_id = review['user_id']
    try:
        cursor = conn.cursor()
        sql = "DELETE FROM Review WHERE review.code_pg = %s and review.user_id = %s"
        cursor.execute(sql,(code_pg,user_id))
        conn.commit()
        conn.close()
        delete_successfull = True
    except Exception as e:
        print("Problem removing from db: " + str(e))
        delete_successfull = False
    if (delete_successfull == True):
        response = "SUCCESS" #review deleted success
    else:
        response = "ERROR" #review deleted failure
    return jsonify(response)

#Get all the reviews written  
@app.route("/api/review/", methods = ['GET'])
def get_all_reviews():
    conn = mysql.connect()
    cursor =conn.cursor()
    cursor.execute("SELECT * FROM Review")
    results = cursor.fetchall()
    conn.close()
    return jsonify(results)

@app.route("/api/report/user/<int:user_id>", methods = ['GET'])
@token_required
def get_report_user(user_id):
    #first check if the user is registered
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "SELECT * FROM User where user_id = %s"
    cursor.execute(sql,user_id)
    result = cursor.fetchall()

    #fetch the review of that user
    if (len(result)!=0):
        try:
            cursor = conn.cursor()
            sql = "SELECT X.*\
                    FROM ( SELECT P.pg_name, T.type, T.subject, T.description, T.creation_date, T.status, E.type_eq\
                                FROM TargetReport as T\
                                INNER JOIN Playground as P\
                                ON T.code_pg = P.code_pg\
                                INNER JOIN Equipment as E\
                                on T.code_pg = E.code_pg and T.id_equip = E.id_equip\
                            WHERE user_id = %s\
                            UNION\
                            SELECT P.pg_name, G.type, G.subject, G.description, G.creation_date, G.status, 'no' AS EndOfcol\
                                FROM GlobalReport as G\
                                INNER JOIN Playground as P\
                                ON G.code_pg = P.code_pg\
                            WHERE user_id = %s ) X\
                    ORDER BY X.`creation_date` DESC"
            cursor.execute(sql,(user_id, user_id))
            result = cursor.fetchall() #get all the review of the user +user_id+
            conn.close()
            if(len(result)!= 0):
                return jsonify(result), 200
            else:
                return jsonify({'message': 'no reports'}), 200
        except:
            return jsonify({'message':'problems getting the reports'})
    else:
        return jsonify({'message':'no user with this id'})

#All the review published by a single user 
@app.route("/api/review/user/<int:user_id>", methods = ['GET'])
@token_required
def get_review_user(user_id):
    #first check if the user is registered
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "SELECT * FROM User where user_id = %s"
    cursor.execute(sql,user_id)
    result = cursor.fetchall()

    #fetch the review of that user
    if (len(result)!=0):
        try:
            cursor = conn.cursor()
            sql = "SELECT  P.pg_name, P.pg_address, R.content, R.score, R.creation_date\
                   FROM Review as R\
                   INNER JOIN Playground as P\
                   ON R.code_pg = P.code_pg\
                   WHERE R.user_id = %s ORDER BY creation_date DESC"
            cursor.execute(sql,(user_id))
            result = cursor.fetchall() #get all the review of the user +user_id+
            conn.close()
            if(len(result)!= 0):
                return jsonify(result), 200
            else:
                return jsonify({'message': 'no reviews'}), 200
        except:
            return jsonify({'message':'problems getting the reviews'})
    else:
        conn.close()
        return jsonify({'message':'no user with this id'})


#All the review made for a playground  #si potrebbe aggiungere un controllo dell'asistenza o meno del parcogioghi
#del tipo : Fai una query per vedere se esiste, se lo è controlla ci siano delle recensioni fatte
@app.route("/api/review/playground/<code_pg>", methods = ['GET'])
def get_review_pg(code_pg):
    #check if the park exists
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "SELECT * FROM Playground where code_pg = %s"
    cursor.execute(sql,(code_pg))
    result = cursor.fetchall()

    #fetch the review of that park
    if (len(result)!=0):
        try:
            cursor = conn.cursor()
            sql = "SELECT  U.user_id, U.user_name, U.user_surname, R.content, R.score, R.creation_date\
                   FROM Review as R\
                   INNER JOIN User as U\
                   ON R.user_id = U.user_id\
                   WHERE R.code_pg = %s ORDER BY creation_date DESC" 
            cursor.execute(sql,(code_pg))
            result = cursor.fetchall() 
            conn.close()
            if(len(result)!= 0):
                return jsonify(result), 200
            else:
                return jsonify({'message': 'no reviews'}) , 200
        except:
            return jsonify({'message':'problems getting the reviews'})
    else:
        conn.close()
        return jsonify({'message':'playground does not exist'})

#TODO PROBLEMA CON UTF-8


#USER REGISTRATION
@app.route("/api/register/", methods = ['POST'])
def register_user():
    data = request.get_json()
    conn = mysql.connect()
    user_name = data['user_name']
    user_surname = data['user_surname']
    user_email = data['user_email']
    password_hash = pwd_context.encrypt(data['password_one']) #calculate the password hash

    try:
        cursor = conn.cursor()
        sql = "SELECT * FROM User where user_email = %s"
        cursor.execute(sql,(user_email)) #check if the email has not been already used
        result = cursor.fetchall()
        if (len(result) == 0 ):
           sql = "INSERT INTO User (user_name,user_surname,user_email, password) VALUES (%s, %s,%s,%s)"
           cursor.execute(sql,(user_name,user_surname,user_email,password_hash))
           conn.commit() #user registered
           token = send_confirm_email(user_email, user_name)
           conn.close()
           return jsonify({"message":"success", "confimation_token": token}), 200
        else:
            return jsonify({'message':'email already used'}),200
    except:
        return jsonify({'message':'problem registering user'}), 200

#send the confirm email
def send_confirm_email(user_email, user_name):
    token = jwt.encode({'user_email' : user_email , 'exp' : datetime.datetime.utcnow() + datetime.timedelta(days=7)}, app.config['CONFIRMATION_KEY'])
    confirm_url = url_for('confirm_email', token=token, _external=True)
    html_confirm = render_template('activate_account.html', confirm_url = confirm_url, user_name = user_name)
    msg = Message(subject="Conferma il tuo indirizzo email!",
                sender=app.config.get("MAIL_USERNAME"),
                recipients=[user_email], # replace with your email for testing
                html = html_confirm)
    mail.send(msg)
    return token


#validate the confirm token recived by email
@app.route("/confirm/<token>", methods = ["GET"])
def confirm_email(token):
    conn = mysql.connect()
    try:
        data = jwt.decode(token, app.config['CONFIRMATION_KEY'],algorithms="HS256")
        user_email = data['user_email']
        cursor = conn.cursor()
        sql = "SELECT confirmed, user_name, user_id FROM User where user_email = %s"
        cursor.execute(sql,(user_email)) #check if the email has not been already used
        result = cursor.fetchone()

        if (result['confirmed'] == 0):
            sql = "UPDATE User SET confirmed = 1 where user_email = %s"
            cursor.execute(sql,(user_email))
            conn.commit()
            conn.close()
            setdefaultprofilepicture(result['user_id'])
            confirm_status = "Il tuo account è stato confermato correttamente. Grazie per essere un utente di Find&Play"
            return render_template('confirm_status.html', confirm_status = confirm_status, user_name = 'Ciao, '+ result['user_name'])
        else:
            confirm_status = "Il tuo account è già stato confermato correttamente. Grazie per essere un utente di Find&Play"
            return render_template('confirm_status.html', confirm_status = confirm_status, user_name = 'Ciao, ' + result['user_name'])
    except:
        confirm_status = "Questo indirizzo non è valido. Contattaci all'indirizzo email: findplaypolito@gmail.com"
        return render_template('confirm_status.html', confirm_status = confirm_status, user_name = "Ops, c'è stato un errore!")

def setdefaultprofilepicture(user_id):
    random_img = random.randint(1,15)
    shutil.copy('/home/findplay/FindPlay/static/default_profile_pictures/'+str(random_img)+'.jpg', '/home/findplay/FindPlay/static/profile_pictures/'+str(user_id)+'.jpg')




#verrà usata per ottenere il token
@app.route("/api/login/", methods = ['POST'])
def login():
    conn = mysql.connect()
    authentication = request.get_json()
    try:
        cursor = conn.cursor()
        sql = "SELECT user_id, user_name, password, confirmed from User where user_email = %s"
        cursor.execute(sql,(authentication["user_email"]))
        result = cursor.fetchone()
        stored_hash = result["password"] #extract the hash from the results 
        check_passwords_equal = pwd_context.verify(authentication['password'], stored_hash)
        conn.close()

        if (check_passwords_equal == True):
            if(result["confirmed"] == 1):
                token = jwt.encode({'user_email' : authentication["user_email"] , 'exp' : datetime.datetime.utcnow() + datetime.timedelta(days=7)}, app.config['SECRET_KEY'])
                return jsonify({"message":"success","token": token, "user_id": result["user_id"]})
            else:
                send_confirm_email(authentication["user_email"], result["user_name"])
                return jsonify({"message":"not confirmed"})
        else:
            return jsonify({"message":"wrong password"})
    except:
        if (check_existing_email(authentication["user_email"]) == False):
            return jsonify({"message":"email not registered"})
        else:
            return jsonify({"message":"problems logging in"})

def check_existing_email(email):
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "SELECT * from User where user_email = %s"
    cursor.execute(sql,(email))
    result = cursor.fetchall()
    if (len(result) == 0):
        return False #no email 


#verify token, if is going to expire soon, send a new one, so that the user can still log
@app.route("/api/verifytoken/", methods = ["POST"])
def verify_token():
    data = request.get_json()
    try: 
        data = jwt.decode(data["token"], app.config['SECRET_KEY'],algorithms="HS256")
        time_now= int(time.time())
        print(data['exp'] - time_now)
        if ((data['exp'] - time_now) < 172800): #token refreshes if it is going to expire in 2 days
            user_email = data['user_email']
            token = jwt.encode({'user_email' : user_email , 'exp' : datetime.datetime.utcnow() + datetime.timedelta(weeks=1)}, app.config['SECRET_KEY'])
            return jsonify({"message":"new token","token": token}) ,200
        else:
            return jsonify({"message":"token valid"}), 200
    except:
        return jsonify({'message' : 'token is invalid'}), 200


@app.route("/api/user/<int:user_id>", methods = ["GET"])
def user_info(user_id):
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "SELECT user_name, user_surname, user_email from User where user_id = %s"
    cursor.execute(sql,(user_id))
    result = cursor.fetchone()
    conn.close()
    return jsonify(result)



@app.route("/api/report/globalreport/", methods = ['POST'])
#token
def publish_report():
    conn = mysql.connect()
    report = request.get_json()
    code_pg = report['code_pg']
    user_id = report['user_id']
    category = report['category']
    subject = report['subject']
    description = report['description']
    imgstring = report['image']
    
    try:
        cursor = conn.cursor()
        sql = " SELECT * FROM GlobalReport\
                WHERE creation_date > DATE_SUB(CURDATE(), INTERVAL 1 DAY) and user_id = %s and code_pg = %s "
        cursor.execute(sql,(user_id,code_pg))
        data = cursor.fetchall()
        if len(data) == 0:
            cursor = conn.cursor()
            sql = "INSERT INTO GlobalReport (code_pg,user_id,type,subject,description) VALUES (%s, %s,%s,%s,%s)"
            cursor.execute(sql,(code_pg,user_id,category,subject,description))
            conn.commit()
            conn.close()

            if imgstring != '':
                imgdata = base64.b64decode(imgstring)
                time_now = int(time.time()) 
                filename = code_pg  + '_' +  str(user_id) + '_' + str(time_now)
                filepath = '/home/findplay/FindPlay/static/report_pictures/globalreports/'+filename+'.jpg'
                try:
                    with open(filepath, 'wb') as f:
                        f.write(imgdata)
                except:
                    print('Problem loading img')


            return jsonify ({"message":"report inserted"})
        else:
            conn.close()
            return jsonify ({"message":"report already sent in the past 24h"})
    except:
        return jsonify ({"message":"problem inserting report"})


@app.route("/api/report/targetreport/", methods = ['POST'])
@token_required
def publish_report_equipment():
    conn = mysql.connect()
    report = request.get_json()
    code_pg = report['code_pg']
    user_id = report['user_id']
    id_equi = report['id_equi']
    category = report['category']
    subject = report['subject']
    description = report['description']
    imgstring = report['image']
    
    try:
        cursor = conn.cursor()
        sql = " SELECT * FROM TargetReport\
                WHERE creation_date > DATE_SUB(CURDATE(), INTERVAL 1 DAY) and user_id = %s and code_pg = %s and id_equip = %s "
        cursor.execute(sql,(user_id,code_pg,id_equi))
        data = cursor.fetchall()
        if len(data) == 0:
            cursor = conn.cursor()
            sql = "INSERT INTO TargetReport (code_pg,id_equip, user_id,type,subject,description) VALUES (%s, %s,%s,%s,%s,%s)"
            cursor.execute(sql,(code_pg, id_equi,user_id,category,subject,description))
            conn.commit()

            if imgstring != '':
                imgdata = base64.b64decode(imgstring)
                time_now = int(time.time()) 
                filename = code_pg + '_'+ str(id_equi) + '_' +  str(user_id) + '_' + str(time_now)
                filepath = '/home/findplay/FindPlay/static/report_pictures/targetreports/'+filename+'.jpg'
                try:
                    with open(filepath, 'wb') as f:
                        f.write(imgdata)
                except:
                    print('Problem loading img')

            return jsonify ({"message":"report inserted"})
        else:
            return jsonify ({"message":"report already sent in the past 24h"})
        conn.close()
    except Exception as e:
        #A volte l'inserimento non va a buon fine perchè è già presente una recensione di quel parco e di quell'utente
        print("Problem inserting into db: " + str(e))
        return jsonify({"message":"review not inserted" + str(e)})



@app.route("/api/playground/filter/", methods=["POST"])
def filter_by_typology():

    list_of_requirements = request.get_json()
    cat = list_of_requirements["category"]
    age = list_of_requirements["age"]
    accessibility = list_of_requirements["accessibility"]
    inclusive = list_of_requirements["inclusive"]

    conn = mysql.connect()

    cursor = conn.cursor()
    if len(cat) == 7: #If no cat is selected I pass them all
        query = "SELECT code_pg FROM Playground"
        cursor.execute(query)
        list_of_parks = [p["code_pg"] for p in cursor.fetchall()]
    else:
        query = "SELECT code_pg, category FROM Equipment"
        cursor.execute(query)
        parcks = cursor.fetchall()
        df = pd.DataFrame(parcks)
        df1 = df.groupby('code_pg')['category'].apply(list).reset_index(name='strutture')
        list_of_parks = []
        for s in df1.values:
            check = all(item in s[1] for item in cat)
            if check == True: #significa che tutti gli elementi di cat sono nella lista dei parchi scelti dall'utente
                list_of_parks.append(s[0])

    if len(list_of_parks) == 0:
        return jsonify({"message":"nessun parco trovato"})
    else:
        query = "SELECT code_pg FROM Playground WHERE pg_age >= %s AND accessibile >= %s AND inclusive >= %s" 
        cursor.execute(query, (age, accessibility, inclusive,))
        conn.close()
        found_parks = cursor.fetchall()
        if len(found_parks)==0:
            return jsonify({"message":"nessun parco trovato"})
        else:
            found_parks = [p["code_pg"] for p in found_parks]
            found_parks = list(set(found_parks))
            if len(list_of_parks) > 0: #se non ci sono strutture non può fare l'intersezione con un set vuoto
                found_parks = [value for value in list_of_parks if value in found_parks]
                if len(found_parks) == 0:
                    return jsonify({"message":"nessun parco trovato"})
                else:

                     return jsonify({"message":found_parks})
            else: 
                return jsonify({"message":"nessun parco trovato"})

@app.route('/api/uploadprofilepic/', methods = ["POST"])
def uploadprofilepic():
    data = request.get_json()
    imgstring = data['imgstring']
    user_id = data['user_id']
    imgdata = base64.b64decode(imgstring)
    filename = '/home/findplay/FindPlay/static/profile_pictures/'+user_id+'.jpg'  # I assume you have a way of picking unique filenames
    try:
        with open(filename, 'wb') as f:
            f.write(imgdata)
        return jsonify({'message':'picture loaded'})
    except:
        return jsonify({'message':'picture not loaded'})

@app.route('/api/recoverpassword/', methods = ['POST'])
def recoverpassword():
    data = request.get_json()
    user_email = data['user_email']
    conn = mysql.connect()

    try:
        cursor = conn.cursor()
        sql = "SELECT * FROM User where user_email = %s"
        cursor.execute(sql,(user_email)) #check if the email has not been already used
        result = cursor.fetchall()
        if (len(result) == 0):
            return jsonify ({ "message":"email address not registered"})
        else:
            send_recover_password(user_email, result[0]["user_name"])
            return jsonify ({"message":"email sent"})
    except Exception as e:
        return jsonify ({"message":"problem recovering password"})


#send the confirm email
def send_recover_password(user_email, user_name):
    token = jwt.encode({'user_email' : user_email, 'user_name': user_name, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=10)}, app.config['SECRET_KEY'])
    restore_url = url_for('restore', token=token, _external=True)
    html_confirm = render_template('restore_password_email.html', restore_url = restore_url, user_name = user_name)
    msg = Message(subject="Recupera la tua password!",
                sender=app.config.get("MAIL_USERNAME"),
                recipients=[user_email], # replace with your email for testing
                html = html_confirm)
    mail.send(msg)
    return token


#validate the confirm token recived by email
@app.route("/api/restore/<token>", methods = ["GET","POST"])
def restore(token):
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'],algorithms="HS256")
        
        special_charachters = ['@','#','$','%','^','&','+','=','^','?']

        if request.method=='POST':
            contains_digit = False
            password_one = request.form["password_one"]
            password_two = request.form["password_two"]

            for character in password_one:
                if character.isdigit():
                    contains_digit = True
            wierd_char = False
            for character in password_one:
                if character in special_charachters:
                    wierd_char = True

            if password_one != password_two:
                flash('Le due password devono coincidere')
                return redirect(url_for('restore', token=token, _external=True)) 
            elif (len(password_one)) < 8:
                flash('La password deve essere lunga almeno 8 caratteri')
                return redirect(url_for('restore', token=token, _external=True)) 
            elif (contains_digit == False):
                flash('La password deve contenere almeno un numero')
                return redirect(url_for('restore', token=token, _external=True)) 
            elif (wierd_char == True):
                flash("La password non puo contenere caratteri come: '@','#','$','%','^','&','+','=','^','?'" )
            else:
                conn = mysql.connect()
                password_hash = pwd_context.encrypt(password_one)
                cursor = conn.cursor()
                sql = "UPDATE User SET password = %s where user_email = %s"
                cursor.execute(sql,(password_hash,data['user_email']))
                conn.commit()
                conn.close()
                return render_template('password_changed.html', user_name = data['user_name'])

        else: 
            return render_template('restore_password.html' ,user_name = data['user_name'])
            
    except Exception as e:
        return jsonify({'messaage':'token not valid' + str(e)})


""" INIZIO API WEB PLATFORM """
@app.route('/findplay')
def my_form():
    return render_template('login.html')


@app.route('/findplay', methods = ['GET','POST'])
def login_wp():
    conn = mysql.connect()
    if request.method=='POST':
        username = request.form["u"]
        password = request.form["p"]
        cursor = conn.cursor()
        query = "SELECT * FROM Representatives where fiscal_code = %s"
        cursor.execute(query, (username))
        data = cursor.fetchone()
        if data is None:
            flash("Codice fiscale o password non validi")
            return redirect(url_for('login_wp')) 
        stored_hash = data["password"] 
        check_passwords_equal = pwd_context.verify(password, stored_hash)
        #print(check_passwords_equal)
        if check_passwords_equal is False:
            flash("Codice fiscale o password non validi")
            conn.close()
            return redirect(url_for('login_wp'))
        else:
            session["username"] = username
            conn.close()
            return redirect(url_for("show_parks"))


@app.route("/findplay/playgrounds", methods = ['GET'])
def show_parks():
    conn = mysql.connect()
    if len(list(session))!=0:
        cursor = conn.cursor()
        select_circ = "SELECT circ FROM Representatives WHERE fiscal_code = %s"
        cursor.execute(select_circ, (session['username']))
        circ = cursor.fetchone()

        query = "SELECT * FROM Playground WHERE Playground.pg_circo = %s"
        cursor.execute(query, (circ["circ"]))
        parks = cursor.fetchall()
        
        for park in parks:
            # Count number of reports to be still reading (global + target)
            reports = 0
            query =" SELECT COUNT(*) FROM TargetReport WHERE status = 0 AND code_pg = %s"
            cursor.execute(query,(park["code_pg"]))
            new_reports = cursor.fetchone()
            reports += new_reports["COUNT(*)"]
            query =" SELECT COUNT(*) FROM GlobalReport WHERE status = 0 AND code_pg = %s"
            cursor.execute(query,(park["code_pg"]))
            new_reports = cursor.fetchone()
            reports += new_reports["COUNT(*)"]
            park["num_new_reports"] = reports

            # Count number of received reports (read + not read) (global + target)
            reports = 0
            query =" SELECT COUNT(*) FROM TargetReport WHERE code_pg = %s"
            cursor.execute(query,(park["code_pg"]))
            new_reports = cursor.fetchone()
            reports += new_reports["COUNT(*)"]
            query =" SELECT COUNT(*) FROM GlobalReport WHERE code_pg = %s"
            cursor.execute(query,(park["code_pg"]))
            new_reports = cursor.fetchone()
            reports += new_reports["COUNT(*)"]
            park["num_reports"] = reports
        conn.close()
        return render_template("representative.html", parks=parks, circ=circ["circ"])
    else:
        conn.close()
        return redirect(url_for("login_wp"))

@app.route("/findplay/playgrounds/<codice_parco>", methods=["GET"])
def show_reviews(codice_parco):
    conn = mysql.connect()
    cursor=conn.cursor()
    query="SELECT * FROM Review WHERE code_pg = %s"
    cursor.execute(query, (codice_parco)) 
    reviews = cursor.fetchall()
    for r in reviews:
        r["creation_date"] = r["creation_date"].strftime("%d/%m/%Y %H:%M:%S") #change format of date
    query = "SELECT * FROM Equipment WHERE code_pg = %s"
    cursor.execute(query, (codice_parco))
    structures = cursor.fetchall()
    for struct in structures:
        # Count number of reports to be still reading for each structure
        query = "SELECT COUNT(*) FROM TargetReport WHERE code_pg = %s AND id_equip = %s AND status = 0;"
        cursor.execute(query, (codice_parco, struct["id_equip"]))
        new_reports = cursor.fetchone()
        struct["num_new_reports"] = new_reports["COUNT(*)"]

        # Count number of received reports (read + not read) for each structure
        query = "SELECT COUNT(*) FROM TargetReport WHERE code_pg = %s AND id_equip = %s;"
        cursor.execute(query, (codice_parco, struct["id_equip"]))
        new_reports = cursor.fetchone()
        struct["num_reports"] = new_reports["COUNT(*)"]

    query = "SELECT * FROM GlobalReport WHERE code_pg = %s"
    cursor.execute(query, (codice_parco))
    globalrep = cursor.fetchall()
    for rep in globalrep:
        rep["unixtime"] = int(datetime.datetime.timestamp(rep["creation_date"]))
        rep["creation_date"] = rep["creation_date"].strftime("%d/%m/%Y %H:%M:%S")
        if rep["status"] == 0: #se r["status"]==0 scrivi no, altrimenti scrivi si
            rep["status"]="No"
        elif rep["status"] == 1:
            rep["status"]="Si"

    query = "SELECT * from Playground WHERE code_pg = %s"
    cursor.execute(query, codice_parco)
    parco = cursor.fetchone()
    conn.close()
    return render_template("structures.html", structures=structures, reviews=reviews, parco=parco, globalrep=globalrep)


@app.route("/findplay/playgrounds/<codice_parco>/<codice_struttura>", methods=["GET"])
def show_reports(codice_parco, codice_struttura):
    conn = mysql.connect()
    cursor=conn.cursor()
    query="SELECT * FROM TargetReport WHERE id_equip = %s AND code_pg = %s"
    cursor.execute(query, (codice_struttura, codice_parco)) 
    reports = cursor.fetchall()
    for r in reports:
        r["unixtime"] = int(datetime.datetime.timestamp(r["creation_date"]))
        r["creation_date"] = r["creation_date"].strftime("%d/%m/%Y %H:%M:%S")
        if r["status"] == 0: #se r["status"]==0 scrivi no, altrimenti scrivi si
            r["status"]="No"
        elif r["status"] == 1:
            r["status"]="Si"
    query="SELECT type_eq FROM Equipment WHERE id_equip = %s AND code_pg = %s"
    cursor.execute(query, (codice_struttura, codice_parco))
    tipo_struttura=cursor.fetchone()
    tipo_struttura = tipo_struttura["type_eq"]
    conn.close()
    return render_template("reports.html", reports=reports, tipo_struttura=tipo_struttura, codice_struttura=codice_struttura)

@app.route('/findplay/logout')
def logout_pw():
    session.pop('username',None)
    return redirect(url_for('my_form'))


@app.route("/findplay/report/<code_pg>/<user_id>/<unixtime>",methods=["GET","POST"])
def repo(code_pg, user_id, unixtime):
    conn = mysql.connect()
    if request.method=='GET':
        try:
            cursor=conn.cursor()
            query="UPDATE TargetReport SET status = 1 WHERE code_pg = %s AND user_id = %s AND creation_date = FROM_UNIXTIME(%s)"
            a = cursor.execute(query, (code_pg, user_id, unixtime))
            conn.commit()
            conn.close()
            return ('',204)
        except Exception as e:
            return (''+str(e))


    
@app.route("/findplay/globalreport/<code_pg>/<user_id>/<unixtime>") #lasciare globalreport scritto in lowercase
def globrepo(code_pg, user_id, unixtime):
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        query="UPDATE GlobalReport SET status = 1 WHERE code_pg = %s AND user_id = %s AND creation_date = FROM_UNIXTIME(%s)" 
        cursor.execute(query, (code_pg, user_id, unixtime))
        conn.commit()      
        conn.close()
        return('',204)
    except Exception as e:
        return (''+str(e))


""" FINE API WEB PLATFORM"""  











@app.route("/")
def index():
    return render_template('landingpage.html')
   
#Avvio dell'app flask
if __name__ == "__main__":
    app.run(host = '0.0.0.0', debug=True)

