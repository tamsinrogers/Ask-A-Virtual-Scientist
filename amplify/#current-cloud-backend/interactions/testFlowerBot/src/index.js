const response = require('./cfn-response');
const { IAMClient, CreateServiceLinkedRoleCommand, GetRoleCommand } = require('@aws-sdk/client-iam');
const { LambdaClient, AddPermissionCommand} = require('@aws-sdk/client-lambda');
const { LexModelBuildingServiceClient, DeleteBotCommand, GetSlotTypeCommand, PutSlotTypeCommand, GetIntentCommand,
PutIntentCommand, GetBotCommand, PutBotCommand
} = require('@aws-sdk/client-lex-model-building-service');
const iamClient = new IAMClient({});
const lambdaClient = new LambdaClient({});
exports.handler = function(event, context) {
    const lex = new LexModelBuildingServiceClient({ region: event.ResourceProperties.lexRegion });
    if (event.RequestType === 'Delete') {
        let botName = "OrderFlowers";
        if(process.env.ENV && process.env.ENV !== "NONE") {
            botName = botName + '_' + process.env.ENV;
        }
        lex.send(new DeleteBotCommand({name: botName}))
        .then(() => {
            response.send(event, context, response.SUCCESS);
        })
        .catch((err) => {
            if (err.name !== 'NotFoundException') {
                response.send(event, context, response.FAILED);
            } else {
                response.send(event, context, response.SUCCESS);
            }
        });
        return;
    }
    let newSlotTypeParams = [
        
        
        {
            "name": "FlowerTypes",
            "description": "Types of flowers to pick up",
            "enumerationValues": [
                
                {
                    "value": "tulips"
                },
                
                {
                    "value": "lilies"
                },
                
                {
                    "value": "roses"
                },
                
            ]
        },
        
        
    ];
    let intentParams = [
        
        {
            "name": "OrderFlowers" + "_" + process.env.ENV,
            
            "confirmationPrompt": {
                "maxAttempts": 2,
                "messages": [
                    {
                        "content": "Okay, your {FlowerType} will be ready for pickup by {PickupTime} on {PickupDate}. Does this sound okay?",
                        "contentType": "PlainText"
                    }
                ]
            },
            
            
            "rejectionStatement": {
                "messages": [
                    {
                    "content": "Okay, I will not place your order.",
                    "contentType": "PlainText"
                    }
                ]
            },
        
            "sampleUtterances": [
            
                "I would like to order some flowers",
            
                "I would like to pick up flowers",
            
            ],
        
            "fulfillmentActivity": {
                "type": "ReturnIntent"
            },
        
            "slots": [
                
                {
                    "name": "FlowerType",
                    "slotConstraint": "Required",
                    "priority": 0,
                    "slotType": "FlowerTypes",
                    "slotTypeVersion": "$LATEST",
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "What type of flowers would you like to order?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "PickupDate",
                    "slotConstraint": "Required",
                    "priority": 1,
                    "slotType": "AMAZON.DATE",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "What day do you want the {FlowerType} to be picked up?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "PickupTime",
                    "slotConstraint": "Required",
                    "priority": 2,
                    "slotType": "AMAZON.TIME",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "At what time do you want the {FlowerType} to be picked up?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
            ]
        },
        
    ];
    let botName = "OrderFlowers";
    if(process.env.ENV && process.env.ENV !== "NONE") {
      botName = botName + '_' + process.env.ENV;
    }

    let botParams = {
        "name": botName,
        "intents": [
        
            {
                "intentName": "OrderFlowers" + "_" + process.env.ENV,
                "intentVersion": "$LATEST"
            },
        
        ],
        "childDirected": false,
        "locale": "en-US",
        "abortStatement": {
            "messages": [
                {
                    "content": "I don't understand. Can you try again?",
                    "contentType": "PlainText"
                },
                {
                    "content": "I'm sorry, I don't understand.",
                    "contentType": "PlainText"
                }
            ]
        },
        "clarificationPrompt": {
            "maxAttempts": 3,
            "messages": [
                {
                    "content": "I'm sorry, I didn't hear that. Can you repeat what you just said?",
                    "contentType": "PlainText"
                },
                {
                    "content": "Can you say that again?",
                    "contentType": "PlainText"
                }
            ]
        },
        
        "voiceId": "Matthew",
        
        
        "idleSessionTTLInSeconds": 300
        
    };

    checkAndCreateLexServiceRole()
    .then(()=>{ return getSlotTypes(newSlotTypeParams, lex);})
    .then(()=>{ return putSlotTypes(newSlotTypeParams, lex);})
    .then(()=>{ return getIntents(intentParams, lex);})
    .then(()=>{ return putIntents(intentParams, lex);})
    .then(()=>{ return getBot(botParams, lex);})
    .then(()=>{ return putBot(botParams, lex);})
    .then((res) => {
        response.send(event, context, response.SUCCESS, res.ApplicationResponse);
    })
    .catch((err) => {
        console.log(err.stack);
        response.send(event, context, response.FAILED, {Error: err});
        throw err;
    });
};

function checkAndCreateLexServiceRole() {

    return checkIfLexServiceRoleExists()
    .then((roleExists) => {
        if(!roleExists) {
            return createNewLexServiceRole();
        }
    });
}

function createNewLexServiceRole() {

    // Lex service automatically creates the needed policies and trust relationships
    const params = {
      AWSServiceName: 'lex.amazonaws.com',
      Description: 'Allows Amazon Lex to create and manage voice enabled bots on your behalf'
    };

    return iamClient.send(new CreateServiceLinkedRoleCommand(params));

}

function checkIfLexServiceRoleExists() {
    let rolePresent;

    const params = {
        RoleName: "AWSServiceRoleForLexBots"
    };

    return iamClient.send(new GetRoleCommand(params))
    .then((result) => {
        rolePresent = true;
        return rolePresent;
    })
    .catch((e) => {
        rolePresent = false;
        return rolePresent;
    });
}

function getSlotTypes(newSlotTypeParams, lex){
    const tasks = [];
    newSlotTypeParams.forEach( slotType => {
        const params = {
            'name': slotType.name,
            'version': '$LATEST'
        };
        tasks.push(
            lex.send(new GetSlotTypeCommand(params))
            .then((data)=>{
                slotType['checksum'] = data.checksum;
            })
            .catch((err)=>{
            })
        );
    });
    return Promise.all(tasks);
}

function putSlotTypes(newSlotTypeParams, lex){
    const tasks = [];
    newSlotTypeParams.forEach( slotType => {
        tasks.push(
            lex.send(new PutSlotTypeCommand(slotType))
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err);
                throw err;
            })
        );
    });
    return Promise.all(tasks);
}

function getIntents(intentParams, lex){
    const tasks = [];
    intentParams.forEach( intent => {
        const params = {
            'version': '$LATEST',
            'name': intent.name
        };
        tasks.push(
            lex.send(new GetIntentCommand(params))
            .then((data)=>{
                intent['checksum'] = data.checksum;
            })
            .catch((err)=>{
            })
        );
    });
    return Promise.all(tasks);
}

function putIntents(intentParams, lex){
    const tasks = [];
    intentParams.forEach( intent => {
        tasks.push(
            ensureLambdaFunctionAccess(intent)
            .then(()=>{
                delete intent.fulfillmentLambda;
                return lex.send(new PutIntentCommand(intent));
            })
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err);
                throw err;
            })
        );
    });
    return Promise.all(tasks);
}

function ensureLambdaFunctionAccess(intent){
    if(intent.fulfillmentLambda){
        const {
            region,
            accountId,
            lambdaArn,
            lambdaName
        } = intent.fulfillmentLambda;

        const params = {
            FunctionName: lambdaName,
            StatementId: `Lex-${intent.name}`+ "17db5c0c",
            Action: 'lambda:InvokeFunction',
            Principal: 'lex.amazonaws.com',
            SourceArn: `arn:aws:lex:${region}:${accountId}:intent:${intent.name}:*`,
        }

        return lambdaClient.send(new AddPermissionCommand(params))
                .then((data)=>{
                    console.log(data);
                    return data;
                })
                .catch((err)=>{
                    console.log(err);
                    throw err;
                });
    }else{
        return Promise.resolve(undefined);
    }
}

function getBot(botParams, lex){
    params = {
        'name': botParams.name,
        'versionOrAlias': '$LATEST'
    };
    return  lex.send(new GetBotCommand(params))
            .then((data)=>{
                botParams['checksum'] = data.checksum;
            })
            .catch((err)=>{
            });
}

function putBot(botParams, lex){
    return lex.send(new PutBotCommand(botParams))
            .then((data)=>{
                console.log(data);
                return data;
            })
            .catch((err)=>{
                console.log(err);
                throw err;
            });
}
