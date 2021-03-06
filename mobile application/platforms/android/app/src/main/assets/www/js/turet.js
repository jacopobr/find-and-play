/**Show on the map Torino's turets */
var turet_list = [
    {
        "long": 7.672313000000001,
        "lat": 45.078125
    },
    {
        "long": 7.607635,
        "lat": 45.075151
    },
    {
        "long": 7.694174,
        "lat": 45.066012
    },
    {
        "long": 7.696357000000001,
        "lat": 45.064819
    },
    {
        "long": 7.695460000000001,
        "lat": 45.064135
    },
    {
        "long": 7.698042999999999,
        "lat": 45.062748
    },
    {
        "long": 7.73338,
        "lat": 45.079910999999996
    },
    {
        "long": 7.624919,
        "lat": 45.06212
    },
    {
        "long": 7.624471000000001,
        "lat": 45.042268
    },
    {
        "long": 7.625839,
        "lat": 45.042134999999995
    },
    {
        "long": 7.618469,
        "lat": 45.07304
    },
    {
        "long": 7.624344000000001,
        "lat": 45.045489
    },
    {
        "long": 7.627891,
        "lat": 45.038365
    },
    {
        "long": 7.6259570000000005,
        "lat": 45.045063
    },
    {
        "long": 7.6292860000000005,
        "lat": 45.04893
    },
    {
        "long": 7.683019,
        "lat": 45.046602
    },
    {
        "long": 7.693638000000001,
        "lat": 45.089989
    },
    {
        "long": 7.6315610000000005,
        "lat": 45.045639
    },
    {
        "long": 7.668221000000001,
        "lat": 45.03447
    },
    {
        "long": 7.627542999999999,
        "lat": 45.043562
    },
    {
        "long": 7.629857,
        "lat": 45.034628000000005
    },
    {
        "long": 7.665221000000001,
        "lat": 45.017078999999995
    },
    {
        "long": 7.663522,
        "lat": 45.01843
    },
    {
        "long": 7.645287,
        "lat": 45.045037
    },
    {
        "long": 7.647156,
        "lat": 45.0444
    },
    {
        "long": 7.675353,
        "lat": 45.046621
    },
    {
        "long": 7.628487,
        "lat": 45.037029
    },
    {
        "long": 7.6297690000000005,
        "lat": 45.037183
    },
    {
        "long": 7.624644,
        "lat": 45.035954
    },
    {
        "long": 7.629392999999999,
        "lat": 45.05053
    },
    {
        "long": 7.621664999999999,
        "lat": 45.050615
    },
    {
        "long": 7.767685,
        "lat": 45.081167
    },
    {
        "long": 7.71568,
        "lat": 45.095326
    },
    {
        "long": 7.723611,
        "lat": 45.099609
    },
    {
        "long": 7.629637,
        "lat": 45.034783000000004
    },
    {
        "long": 7.620091,
        "lat": 45.047083
    },
    {
        "long": 7.620384,
        "lat": 45.033765
    },
    {
        "long": 7.6069059999999995,
        "lat": 45.075061
    },
    {
        "long": 7.624919,
        "lat": 45.041661
    },
    {
        "long": 7.628146000000001,
        "lat": 45.047866
    },
    {
        "long": 7.622412,
        "lat": 45.051965
    },
    {
        "long": 7.642618,
        "lat": 45.054427000000004
    },
    {
        "long": 7.700902,
        "lat": 45.079509
    },
    {
        "long": 7.70153,
        "lat": 45.078789
    },
    {
        "long": 7.6988520000000005,
        "lat": 45.101953
    },
    {
        "long": 7.619122999999999,
        "lat": 45.083101
    },
    {
        "long": 7.628410000000001,
        "lat": 45.081491
    },
    {
        "long": 7.661435000000001,
        "lat": 45.078722
    },
    {
        "long": 7.67674,
        "lat": 45.087808
    },
    {
        "long": 7.681471000000001,
        "lat": 45.084756
    },
    {
        "long": 7.691926,
        "lat": 45.0961
    },
    {
        "long": 7.692152,
        "lat": 45.097403
    },
    {
        "long": 7.691372,
        "lat": 45.101789000000004
    },
    {
        "long": 7.693426,
        "lat": 45.092827
    },
    {
        "long": 7.705058,
        "lat": 45.092948
    },
    {
        "long": 7.71134,
        "lat": 45.090418
    },
    {
        "long": 7.71387,
        "lat": 45.090007
    },
    {
        "long": 7.713183,
        "lat": 45.089183
    },
    {
        "long": 7.698278,
        "lat": 45.088308000000005
    },
    {
        "long": 7.702172,
        "lat": 45.087343
    },
    {
        "long": 7.721566,
        "lat": 45.077599
    },
    {
        "long": 7.7166559999999995,
        "lat": 45.083663
    },
    {
        "long": 7.703697,
        "lat": 45.075868
    },
    {
        "long": 7.698964,
        "lat": 45.081137
    },
    {
        "long": 7.726452,
        "lat": 45.07578
    },
    {
        "long": 7.726369,
        "lat": 45.074940999999995
    },
    {
        "long": 7.715109,
        "lat": 45.073515
    },
    {
        "long": 7.714202,
        "lat": 45.083913
    },
    {
        "long": 7.703819,
        "lat": 45.086546999999996
    },
    {
        "long": 7.7046399999999995,
        "lat": 45.090819
    },
    {
        "long": 7.705775,
        "lat": 45.090861
    },
    {
        "long": 7.68226,
        "lat": 45.067842
    },
    {
        "long": 7.687933999999999,
        "lat": 45.062688
    },
    {
        "long": 7.692433,
        "lat": 45.063178
    },
    {
        "long": 7.644194000000001,
        "lat": 45.120106
    },
    {
        "long": 7.655539999999999,
        "lat": 45.10544
    },
    {
        "long": 7.667145,
        "lat": 45.101775
    },
    {
        "long": 7.668918,
        "lat": 45.074288
    },
    {
        "long": 7.638851,
        "lat": 45.042656
    },
    {
        "long": 7.618664999999999,
        "lat": 45.070505
    },
    {
        "long": 7.632159,
        "lat": 45.06729
    },
    {
        "long": 7.636889,
        "lat": 45.090695000000004
    },
    {
        "long": 7.7014759999999995,
        "lat": 45.089104999999996
    },
    {
        "long": 7.655106,
        "lat": 45.052501
    },
    {
        "long": 7.666967,
        "lat": 45.060874
    },
    {
        "long": 7.672922,
        "lat": 45.07448
    },
    {
        "long": 7.6690179999999994,
        "lat": 45.017088
    },
    {
        "long": 7.663157000000001,
        "lat": 45.021968
    },
    {
        "long": 7.654534,
        "lat": 45.020666999999996
    },
    {
        "long": 7.6734100000000005,
        "lat": 45.029849
    },
    {
        "long": 7.6762429999999995,
        "lat": 45.033612
    },
    {
        "long": 7.6859399999999996,
        "lat": 45.044637
    },
    {
        "long": 7.676796,
        "lat": 45.049172
    },
    {
        "long": 7.68118,
        "lat": 45.055642999999996
    },
    {
        "long": 7.689185,
        "lat": 45.053703999999996
    },
    {
        "long": 7.687908,
        "lat": 45.061647
    },
    {
        "long": 7.700182000000001,
        "lat": 45.063251
    },
    {
        "long": 7.705336999999999,
        "lat": 45.062582
    },
    {
        "long": 7.710047,
        "lat": 45.067207
    },
    {
        "long": 7.6922880000000005,
        "lat": 45.071609
    },
    {
        "long": 7.6928220000000005,
        "lat": 45.071309
    },
    {
        "long": 7.723547,
        "lat": 45.0701
    },
    {
        "long": 7.727252,
        "lat": 45.099828
    },
    {
        "long": 7.700114999999999,
        "lat": 45.070003
    },
    {
        "long": 7.711063,
        "lat": 45.084203
    },
    {
        "long": 7.694807000000001,
        "lat": 45.077077
    },
    {
        "long": 7.664273,
        "lat": 45.068256
    },
    {
        "long": 7.663659,
        "lat": 45.061986
    },
    {
        "long": 7.669160000000001,
        "lat": 45.057501
    },
    {
        "long": 7.634527,
        "lat": 45.058217
    },
    {
        "long": 7.680323,
        "lat": 45.07533
    },
    {
        "long": 7.631728,
        "lat": 45.056615
    },
    {
        "long": 7.68698,
        "lat": 45.084247
    },
    {
        "long": 7.686589,
        "lat": 45.084182
    },
    {
        "long": 7.6472169999999995,
        "lat": 45.046527000000005
    },
    {
        "long": 7.672134,
        "lat": 45.039232
    },
    {
        "long": 7.669374,
        "lat": 45.037512
    },
    {
        "long": 7.700005,
        "lat": 45.101468
    },
    {
        "long": 7.634127,
        "lat": 45.039246999999996
    },
    {
        "long": 7.648791,
        "lat": 45.078188
    },
    {
        "long": 7.641812,
        "lat": 45.079623
    },
    {
        "long": 7.6445669999999994,
        "lat": 45.078976000000004
    },
    {
        "long": 7.644921000000001,
        "lat": 45.079614
    },
    {
        "long": 7.655525,
        "lat": 45.076442
    },
    {
        "long": 7.655548,
        "lat": 45.076454
    },
    {
        "long": 7.655575999999999,
        "lat": 45.076463000000004
    },
    {
        "long": 7.698482,
        "lat": 45.076547999999995
    },
    {
        "long": 7.700947,
        "lat": 45.076339000000004
    },
    {
        "long": 7.694238,
        "lat": 45.068345
    },
    {
        "long": 7.689127,
        "lat": 45.065839000000004
    },
    {
        "long": 7.692117,
        "lat": 45.059983
    },
    {
        "long": 7.690277,
        "lat": 45.058431
    },
    {
        "long": 7.686744,
        "lat": 45.052719
    },
    {
        "long": 7.6226259999999995,
        "lat": 45.074560999999996
    },
    {
        "long": 7.687938000000001,
        "lat": 45.058904
    },
    {
        "long": 7.685438,
        "lat": 45.055553
    },
    {
        "long": 7.665083,
        "lat": 45.064921999999996
    },
    {
        "long": 7.662135,
        "lat": 45.066178
    },
    {
        "long": 7.663036,
        "lat": 45.068031
    },
    {
        "long": 7.661397,
        "lat": 45.069713
    },
    {
        "long": 7.661017,
        "lat": 45.069031
    },
    {
        "long": 7.654456,
        "lat": 45.070975
    },
    {
        "long": 7.638147999999999,
        "lat": 45.075665
    },
    {
        "long": 7.639831,
        "lat": 45.078097
    },
    {
        "long": 7.627894,
        "lat": 45.076745
    },
    {
        "long": 7.624847,
        "lat": 45.076199
    },
    {
        "long": 7.6235800000000005,
        "lat": 45.073321
    },
    {
        "long": 7.623032000000001,
        "lat": 45.070898
    },
    {
        "long": 7.625538000000001,
        "lat": 45.065821
    },
    {
        "long": 7.6237580000000005,
        "lat": 45.066796000000004
    },
    {
        "long": 7.630737,
        "lat": 45.064029999999995
    },
    {
        "long": 7.6306080000000005,
        "lat": 45.072903000000004
    },
    {
        "long": 7.626877,
        "lat": 45.073667
    },
    {
        "long": 7.661455,
        "lat": 45.046984
    },
    {
        "long": 7.688822,
        "lat": 45.089046
    },
    {
        "long": 7.715648,
        "lat": 45.079934
    },
    {
        "long": 7.631767,
        "lat": 45.059936
    },
    {
        "long": 7.630342999999999,
        "lat": 45.060319
    },
    {
        "long": 7.634138,
        "lat": 45.057276
    },
    {
        "long": 7.630661999999999,
        "lat": 45.058546
    },
    {
        "long": 7.623829,
        "lat": 45.040827
    },
    {
        "long": 7.681887,
        "lat": 45.074328
    },
    {
        "long": 7.678667,
        "lat": 45.072845
    },
    {
        "long": 7.679017999999999,
        "lat": 45.072334000000005
    },
    {
        "long": 7.666322,
        "lat": 45.067398
    },
    {
        "long": 7.662425,
        "lat": 45.073644
    },
    {
        "long": 7.686748,
        "lat": 45.068991
    },
    {
        "long": 7.721221000000001,
        "lat": 45.067019
    },
    {
        "long": 7.728192999999999,
        "lat": 45.071852
    },
    {
        "long": 7.716951,
        "lat": 45.094268
    },
    {
        "long": 7.582074,
        "lat": 45.07045
    },
    {
        "long": 7.678656,
        "lat": 45.072828
    },
    {
        "long": 7.675788000000001,
        "lat": 45.072568
    },
    {
        "long": 7.685158,
        "lat": 45.079485999999996
    },
    {
        "long": 7.690333,
        "lat": 45.085407000000004
    },
    {
        "long": 7.674296000000001,
        "lat": 45.102407
    },
    {
        "long": 7.6637830000000005,
        "lat": 45.055510999999996
    },
    {
        "long": 7.646152000000001,
        "lat": 45.046928
    },
    {
        "long": 7.678997,
        "lat": 45.077594
    },
    {
        "long": 7.679981,
        "lat": 45.06377
    },
    {
        "long": 7.651331,
        "lat": 45.060986
    },
    {
        "long": 7.651892,
        "lat": 45.060046
    },
    {
        "long": 7.656467999999999,
        "lat": 45.06116
    },
    {
        "long": 7.642511,
        "lat": 45.025842
    },
    {
        "long": 7.6354630000000006,
        "lat": 45.054371
    },
    {
        "long": 7.628499000000001,
        "lat": 45.056458
    },
    {
        "long": 7.64911,
        "lat": 45.064141
    },
    {
        "long": 7.645182000000001,
        "lat": 45.063185
    },
    {
        "long": 7.645175,
        "lat": 45.066641
    },
    {
        "long": 7.6465570000000005,
        "lat": 45.070397
    },
    {
        "long": 7.644584,
        "lat": 45.075294
    },
    {
        "long": 7.676893,
        "lat": 45.071488
    },
    {
        "long": 7.677174000000001,
        "lat": 45.071395
    },
    {
        "long": 7.68168,
        "lat": 45.066701
    },
    {
        "long": 7.682034,
        "lat": 45.066582000000004
    },
    {
        "long": 7.6467979999999995,
        "lat": 45.024415999999995
    },
    {
        "long": 7.649596000000001,
        "lat": 45.023257
    },
    {
        "long": 7.648049,
        "lat": 45.015858
    },
    {
        "long": 7.6570990000000005,
        "lat": 45.017984999999996
    },
    {
        "long": 7.6569210000000005,
        "lat": 45.019211999999996
    },
    {
        "long": 7.676193,
        "lat": 45.024107
    },
    {
        "long": 7.675727,
        "lat": 45.062814
    },
    {
        "long": 7.6214770000000005,
        "lat": 45.079278
    },
    {
        "long": 7.6348970000000005,
        "lat": 45.087125
    },
    {
        "long": 7.636044,
        "lat": 45.095145
    },
    {
        "long": 7.636079,
        "lat": 45.095294
    },
    {
        "long": 7.628413,
        "lat": 45.096418
    },
    {
        "long": 7.633030000000001,
        "lat": 45.098964
    },
    {
        "long": 7.63468,
        "lat": 45.100218
    },
    {
        "long": 7.636069,
        "lat": 45.103421999999995
    },
    {
        "long": 7.6315669999999995,
        "lat": 45.103504
    },
    {
        "long": 7.631164999999999,
        "lat": 45.103834
    },
    {
        "long": 7.630855,
        "lat": 45.103866
    },
    {
        "long": 7.630380000000001,
        "lat": 45.103608
    },
    {
        "long": 7.716423,
        "lat": 45.072345
    },
    {
        "long": 7.715592999999999,
        "lat": 45.072495
    },
    {
        "long": 7.630319999999999,
        "lat": 45.103488
    },
    {
        "long": 7.63317,
        "lat": 45.103747
    },
    {
        "long": 7.6273990000000005,
        "lat": 45.100146
    },
    {
        "long": 7.627632000000001,
        "lat": 45.099472
    },
    {
        "long": 7.627586,
        "lat": 45.099334000000006
    },
    {
        "long": 7.626942,
        "lat": 45.099340000000005
    },
    {
        "long": 7.62627,
        "lat": 45.099356
    },
    {
        "long": 7.62484,
        "lat": 45.104277
    },
    {
        "long": 7.644709,
        "lat": 45.100402
    },
    {
        "long": 7.646576,
        "lat": 45.100478
    },
    {
        "long": 7.649275,
        "lat": 45.099439000000004
    },
    {
        "long": 7.647187,
        "lat": 45.096613
    },
    {
        "long": 7.645153,
        "lat": 45.096361
    },
    {
        "long": 7.642063,
        "lat": 45.097460999999996
    },
    {
        "long": 7.6411169999999995,
        "lat": 45.098335999999996
    },
    {
        "long": 7.642461,
        "lat": 45.099241
    },
    {
        "long": 7.641807000000001,
        "lat": 45.099236
    },
    {
        "long": 7.6400820000000005,
        "lat": 45.099404
    },
    {
        "long": 7.664045,
        "lat": 45.076136
    },
    {
        "long": 7.636077,
        "lat": 45.076316
    },
    {
        "long": 7.630004,
        "lat": 45.08335
    },
    {
        "long": 7.674032,
        "lat": 45.070941999999995
    },
    {
        "long": 7.647013,
        "lat": 45.079337
    },
    {
        "long": 7.684603999999999,
        "lat": 45.074193
    },
    {
        "long": 7.6344899999999996,
        "lat": 45.036153000000006
    },
    {
        "long": 7.646613,
        "lat": 45.033353999999996
    },
    {
        "long": 7.653791,
        "lat": 45.048358
    },
    {
        "long": 7.646616000000001,
        "lat": 45.033353000000005
    },
    {
        "long": 7.6554,
        "lat": 45.049003000000006
    },
    {
        "long": 7.656352,
        "lat": 45.048609
    },
    {
        "long": 7.656846000000001,
        "lat": 45.048499
    },
    {
        "long": 7.663824000000001,
        "lat": 45.058474
    },
    {
        "long": 7.635667,
        "lat": 45.080299
    },
    {
        "long": 7.656836,
        "lat": 45.075565000000005
    },
    {
        "long": 7.656801,
        "lat": 45.075568
    },
    {
        "long": 7.656764,
        "lat": 45.075565000000005
    },
    {
        "long": 7.652203,
        "lat": 45.079309
    },
    {
        "long": 7.653509,
        "lat": 45.079392
    },
    {
        "long": 7.661683999999999,
        "lat": 45.073615000000004
    },
    {
        "long": 7.683252,
        "lat": 45.046890000000005
    },
    {
        "long": 7.621619,
        "lat": 45.077153
    },
    {
        "long": 7.619739,
        "lat": 45.077399
    },
    {
        "long": 7.626761,
        "lat": 45.086090999999996
    },
    {
        "long": 7.658405,
        "lat": 45.112277
    },
    {
        "long": 7.65923,
        "lat": 45.111043
    },
    {
        "long": 7.659275999999999,
        "lat": 45.110169
    },
    {
        "long": 7.661266,
        "lat": 45.108810999999996
    },
    {
        "long": 7.663130000000001,
        "lat": 45.106713
    },
    {
        "long": 7.667158000000001,
        "lat": 45.100949
    },
    {
        "long": 7.667497999999999,
        "lat": 45.100574
    },
    {
        "long": 7.667472999999999,
        "lat": 45.100559999999994
    },
    {
        "long": 7.667461,
        "lat": 45.100536
    },
    {
        "long": 7.667467,
        "lat": 45.100513
    },
    {
        "long": 7.667486,
        "lat": 45.100493
    },
    {
        "long": 7.667517999999999,
        "lat": 45.100484
    },
    {
        "long": 7.667548,
        "lat": 45.100483000000004
    },
    {
        "long": 7.66776,
        "lat": 45.100334000000004
    },
    {
        "long": 7.667777,
        "lat": 45.100406
    },
    {
        "long": 7.668276,
        "lat": 45.099484000000004
    },
    {
        "long": 7.668449000000001,
        "lat": 45.099334000000006
    },
    {
        "long": 7.667597,
        "lat": 45.097996
    },
    {
        "long": 7.669546,
        "lat": 45.098872
    },
    {
        "long": 7.6705,
        "lat": 45.097718
    },
    {
        "long": 7.6705119999999996,
        "lat": 45.097708000000004
    },
    {
        "long": 7.680486999999999,
        "lat": 45.08746
    },
    {
        "long": 7.643459,
        "lat": 45.085041
    },
    {
        "long": 7.6366,
        "lat": 45.033718
    },
    {
        "long": 7.635273,
        "lat": 45.03383
    },
    {
        "long": 7.683752,
        "lat": 45.079398
    },
    {
        "long": 7.67903,
        "lat": 45.063308
    },
    {
        "long": 7.682981,
        "lat": 45.067568
    },
    {
        "long": 7.6679059999999994,
        "lat": 45.078453
    },
    {
        "long": 7.627241000000001,
        "lat": 45.134663
    },
    {
        "long": 7.638615,
        "lat": 45.128913
    },
    {
        "long": 7.643046000000001,
        "lat": 45.039139
    },
    {
        "long": 7.678121000000001,
        "lat": 45.054212
    }
]

var fountain_visible = 0;
var turet_marker_list = []

function showTuret() {
    if (fountain_visible == 0){
        turet_marker_list = [];
        for(let i = 0; i < turet_list.length; i++){
            var position = new plugin.google.maps.LatLng(turet_list[i].lat, turet_list[i].long);
            var marker = map.addMarker({
              'position': position,
              'icon':{
                'url': 'https://findplay.ddns.net/static/img/water_marker.png',
                'size':{
                  'width': 15,
                  'height': 15
                }
              }
            });
            document.getElementById('fountainFab').style.backgroundColor = "#00b8ff";
            document.getElementById('dropicon').style.color = "#ffffff";
            turet_marker_list.push(marker);
        };

        fountain_visible = 1;
    } else if  (fountain_visible == 1){
        for(let i = 0; i < turet_marker_list.length; i++){
            turet_marker_list[i].setVisible(false);
        }
        document.getElementById('fountainFab').style.backgroundColor = "#ffffff";
        document.getElementById('dropicon').style.color = "#595959";
        fountain_visible = 0;

    }



      
    
}

