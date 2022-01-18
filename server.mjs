import express from "express";
import Alexa, { SkillBuilders } from 'ask-sdk-core';
import morgan from "morgan";
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import script from './scripting.js';
import axios from 'axios'
import mongoose from "mongoose";


mongoose.connect("mongodb+srv://Waqar-Khan123:waqarkhan12345@cluster0.lygb2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

const Usage = mongoose.model("Usage", {
  skillName: String,
  clientName: String,
  createdOn: { type: Date, default: Date.now }

})

const Items = mongoose.model("Items", {
  dish: { item: String, quantity: Number },
  drink: { item: String, quantity: Number },
  createdOn: { type: Date, default: Date.now }

})

const Cart=mongoose.model("Cart",{
  items:[{
    dishName:String,
    quantity:Number
  }],
  email:String,
  customerName:String,
  createdOn:{type:Date,default:Date.now},
})

const app = express();
app.use(morgan("dev"))
const PORT = process.env.PORT || 3000;


let weatherinfo = '';

const WeatherIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WeatherIntent';
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const city = slots.City.value;
    const responce = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=77af052038c15c2ca530a33e81901ee6&units=metric`)
    weatherinfo = responce.data.main.temp;
    let feels_like = responce.data.main.feels_like;
    const weaterType = responce.data.weather[0].main;
    console.log(weatherinfo);
    const speech = [`Temperature of ${city} is ${weatherinfo} degree Centigrade.Weather is ${weaterType} and feel like ${feels_like}. My suggestion is tea, Coffee and kehwa is good in this weather`,
    `Temperature of ${city} is ${weatherinfo} degree Centigrade.Weather is ${weaterType} and feel like ${feels_like}. My suggestion is tea, Coffee and kehwa is good in this weather`,
    `Temperature of ${city} is ${weatherinfo} degree Centigrade.outside Weather is ${weaterType} and feel like ${feels_like}. My suggestion is juice, cold drink , soda and cheeled water`]




    if (city) {
      if (Number(weatherinfo) <= 20) {

        return handlerInput.responseBuilder
          .speak(speech[0])
          .reprompt(speech[0])
          .getResponse();
      }
      else if (Number(weatherinfo) <= 30) {

        return handlerInput.responseBuilder
          .speak(speech[1])
          .reprompt(speech[1])
          .getResponse();
      }
      else if (Number(weatherinfo) <= 40) {

        return handlerInput.responseBuilder
          .speak(speech[2])
          .reprompt(speech[2])
          .getResponse();
      }
      else {
        return handlerInput.responseBuilder
          .speak(`Temperature is too hot please any time you need to hydrated`)
          .reprompt(`Default checking`)
          .getResponse();
      }

    }

  }
};

const OrderDrinkandDishesIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OrderDrinkandDishesIntent';
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const drinks = slots.drink.value;
    const foods = slots.food.value;
    let orderspeek = "";



    try {
      const { serviceClientFactory, responseBuilder } = handlerInput
      const apiAccessToken = Alexa.getApiAccessToken(handlerInput.requestEnvelope)
      console.log("Access Token: ", apiAccessToken)
      const responceArray = await Promise.all([
        axios.get("https://api.amazonalexa.com/v2/accounts/~current/settings/Profile.email", {
          headers: { Authorization: `Bearer ${apiAccessToken}` }
        }),
        axios.get("https://api.amazonalexa.com/v2/accounts/~current/settings/Profile.name",
          { headers: { Authorization: `Bearer ${apiAccessToken}` } },
        )
        
      ])
      const email = responceArray[0].data;
      const name = responceArray[1].data;
      // const upsServiceClient = handlerInput.serviceClientFactory.getUpsServiceClient()
      // const userEmail = await upsServiceClient.getProfileEmail()
      // console.log("userEmail")
      // console.log("userName")
      if (!email) {
        return handlerInput.responseBuilder
          .speak(`looks like you dont have an email associated with this device, please set your email in Alexa App Settings`)
          .getResponse();
      } 
      else if (!name) {
        return handlerInput.responseBuilder
          .speak(`looks like you dont have an name associated with this device, please set your name in Alexa App Settings`)
          .getResponse();
      } 
      else {
        if (drinks === undefined) {
          orderspeek = `Thank you for ordering ${drinks === undefined ? foods : drinks}`

        }
        else if (drinks && foods) {
          orderspeek = `ordering ${drinks} ${foods === "thanks" ? "," : " and"} ${foods === "thanks" ? ', thank you so much.' : foods + ', thank you so much for ordering'}`
        }
        let orderItems = new Items({
          dish: { item: foods, quantity: 1 },
          drink: { item: drinks, quantity: 1 }
        }).save()

        return handlerInput.responseBuilder
          .speak(orderspeek)
          .reprompt(orderspeek)
          .getResponse();
      }

    } catch (error) {
      console.log(error)
      return responseBuilder
        .speak('Uh Oh. Looks like something went wrong.')
        .getResponse();
    }

  }
};





const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
      .getResponse();
  }
};


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {

    let newUsage = new Usage({
      skillName: 'wiki restaurant',
      clientName: "waqar khan"
    }).save()
    return handlerInput.responseBuilder
      .speak(script.launch[0])
      .reprompt(script.launch[0])
      .withSimpleCard("Wiki Restraurant", script.launch[1])
      .getResponse();
  }
};
const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(script.hello[0])
      .reprompt(script.hello[0])
      .getResponse();
  }
};

const DrinkMenuIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DrinksIntent';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(script.drinksMenu[0])
      .reprompt(script.drinksMenu[0])
      .withSimpleCard("Wiki Restaurant (Drinks Menu)\n",script.drinksMenu[1])
      .getResponse();
  }
};
const PastaMenuIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PastaCornerIntent';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(script.pastaMenu[0])
      .reprompt(script.pastaMenu[0])
      .withSimpleCard("Wiki Restaurant (Pasta Menu)\n",script.pastaMenu[1])
      .getResponse();
  }
};
const FishCornerMenuIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FishCornerIntent';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(script.fishMenu[0])
      .reprompt(script.fishMenu[0])
      .withSimpleCard("Wiki Restaurant (Fish Corner Menu)\n",script.fishMenu[1])
      .getResponse();
  }
};
const PakistaniBreadMenuIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PakistaniBreadIntent';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(script.pakistaniBreadMenu[0])
      .reprompt(script.pakistaniBreadMenu[0])
      .withSimpleCard("Wiki Restaurant (Pakistani Bread Menu)\n",script.pakistaniBreadMenu[1])
      .getResponse();
  }
};
const RiceCornerMenuIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RiceCornerIntent';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(script.riceMenu[0])
      .reprompt(script.riceMenu[0])
      .withSimpleCard("Wiki Restaurant (Rise Corner Menu)\n",script.riceMenu[1])
      .getResponse();
  }
};
const FastFoodMenuIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FastFoodIntent';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(script.fastFoodMenu[0])
      .reprompt(script.fastFoodMenu[0])
      .withSimpleCard("Wiki Restaurant (Fast Food Menu)\n",script.fastFoodMenu[1])
      .getResponse();
  }
};
const ShowMenuIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowMenuIntent';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(script.menuCategory[0])
      .reprompt(script.menuCategory[0])
      .withSimpleCard("Wiki Restaurant (menu category)\n",script.menuCategory[1])
      .getResponse();
  }
};


const userEmailHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EmailIntent'
  },
  async handle(handlerInput) {
    const { serviceClientFactory, responseBuilder } = handlerInput
    const apiAccessToken = Alexa.getApiAccessToken(handlerInput.requestEnvelope)
    console.log("Access Token: ", apiAccessToken)
    try {
      // that's a first way to defined user info by api call
      const responceArray = await Promise.all([
        axios.get("https://api.amazonalexa.com/v2/accounts/~current/settings/Profile.email", {
          headers: { Authorization: `Bearer ${apiAccessToken}` }
        }),
        axios.get("https://api.amazonalexa.com/v2/accounts/~current/settings/Profile.name",
          { headers: { Authorization: `Bearer ${apiAccessToken}` } },
        )
      ])
      // second method is dont call api and use axios just use serviceClientFactory
      // const upsServiceClient = serviceClientFactory.getUpsServiceClient()
      // const profileEmail = await upsServiceClient.getProfileEmail()
      // const profileName = await upsServiceClient.getProfileName()
      // console.log(profileName)
      const email = responceArray[0].data;
      const name = responceArray[1].data;
      if (!email) {
        return handlerInput.responseBuilder
          .speak(`looks like you dont have an email associated with this device, please set your email in Alexa App Settings`)
          .getResponse();
      }
      return handlerInput.responseBuilder
        .speak(`Dear ${name}, your email is: ${email}`)
        .getResponse();
    }
    catch (error) {
      console.log("error code: ", error.response.status);

      if (error.response.status === 403) {
        return responseBuilder
          .speak('I am Unable to read your email. Please goto Alexa app and then goto Wiki Tech Skill is for Wiki restaurant and Grant Profile Permissions to this skill')
          .withAskForPermissionsConsentCard(["alexa::profile:email:read"]) // https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-customer-contact-information-for-use-in-your-skill.html#sample-response-with-permissions-card
          .getResponse();
      }
      return responseBuilder
        .speak('Uh Oh. Looks like something went wrong.')
        .getResponse();
    }
  }
}

const deviceIdHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'deviceId';
  },
  handle(handlerInput) {

    let deviceId = Alexa.getDeviceId(handlerInput.requestEnvelope)
    let userId = Alexa.getUserId(handlerInput.requestEnvelope)

    console.log("deviceId: ", deviceId); // amzn1.ask.device.AEIIZKO24SOSURK7U32HYTGXRQND5VMWQTKZDZOVVKFVIBTHIDTGJNXGQLO5TKAITDM756X5AHOESWLLKZADIMJOAM43RKPADYXEHRMI7V6ESJPWWHE34E37GPJHHG2UVZSTUKF3XJUWD5FINAUTKIB5QBIQ
    const speakOutput = `your device id is: ${deviceId} \n\n\nand your user id is: ${userId}`

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const skillBuilder = SkillBuilders.custom()
  .addRequestHandlers(
    DrinkMenuIntentHandler,
    PastaMenuIntentHandler,
    FishCornerMenuIntentHandler,
    PakistaniBreadMenuIntentHandler,
    RiceCornerMenuIntentHandler,
    FastFoodMenuIntentHandler,
    OrderDrinkandDishesIntentHandler,
    WeatherIntentHandler,
    LaunchRequestHandler,
    userEmailHandler,
    deviceIdHandler,
    HelloWorldIntentHandler,
    ShowMenuIntentHandler,
    IntentReflectorHandler,
  )
  .addErrorHandlers(ErrorHandler)  
  


const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);

app.post('/api/v1/webhook-alexa', adapter.getRequestHandlers());

app.use(express.json())
app.get('/profile', (req, res, next) => {
  res.send("Wiki Restaurant Here!");
});
app.get('/', (req, res) => {
  res.send("hello its me")
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});