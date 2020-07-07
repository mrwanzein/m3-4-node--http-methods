'use strict';

const checkIfInDataBase = (arr, toCheck) => {
  let customerKeys = [];
  arr.forEach(x => customerKeys.push(Object.values(x)));

  if(customerKeys.filter(x => x.includes(toCheck)).length > 0) {
    return true;
  } else {
    return false;
  }
}

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { stock, customers } = require('./data/promo');

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .post('/order', (req, res) => {
    let validCountry = false;
    let { givenName, surname, email, address, country, order, size} = req.body;
    
    country === 'Canada' ? validCountry = true : validCountry;
    
    console.log(req.body)

    if(!validCountry) {
      res.send({
        "status": "error",
        "error": "undeliverable"
      });
    } 
    
    else if(order === 'undefined') {
      if(size === 'undefined'){
        res.send({
          "status": "error",
          "error": "missing-data"
        });
      }
    } 
    
    else if(stock[order] === '0') {
        res.send({
          "status": "error",
          "error": "unavailable"
        });
    } 
    
    else if(order === 'shirt') {
      if(size === 'undefined') {
        res.send({
          "status": "error",
          "error": "missing-data"
        });
      } else if(stock[order][size] === '0') {
        res.send({
          "status": "error",
          "error": "unavailable"
        });
      }
    } 
    
    if((!checkIfInDataBase(customers, givenName) || !checkIfInDataBase(customers, surname)) && !checkIfInDataBase(customers, email) && !checkIfInDataBase(customers, address)) {
      res.send({
        status: "success",
      })
    } 
    
    else {
      console.log('whent through')
      res.send({
        "status": "error",
        "error": "repeat-customer"
      });
    }
  })

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(8000, () => console.log(`Listening on port 8000`));
