/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This file implements three promise related functions - defer, fcall and allSettled.
 *
 * @author Dipayan Aich, Arun Jayapal
 * @module oe-promise
 */

/**
   * This function return a {promise, resolve, reject} object
   * @returns {Object} - a object with promise resolve and reject functions
   * @function
   */
function defer(){
    var resolve, reject;

    var p = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });

    var deferred = { 
        promise : p 
    }

    Object.defineProperty(deferred, 'resolve', {
        get: ()=> resolve
    });

    Object.defineProperty(deferred, 'reject', {
        get: ()=> reject
    });

    return deferred;
}

/**
   * This function return a {promise, resolve, reject} object
   * @param {Array} - array of arguments which are functions
   * @returns {Object} - resolved value
   * @function
   */
function fcall(...args){
    var fn = args.shift();
    var r = fn.apply(this, args);
    //return Promise.resolve(r);
    return new Promise(resolve=>{
        process.nextTick(()=>resolve(r))
    });
}

/**
   * This function return a {promise, resolve, reject} object
   * @param {Array} - array of promises
   * @returns {Object} - a object with promise resolve and reject state. returns when all are resolved
   * @function
   */
function allSettled(promises){

    let wrap = promises.map(p => Promise.resolve(p)
        .then(
            val => ({ state: 'fulfilled', value: val }),
            err => ({ state: 'rejected', reason: err })));
    return Promise.all(wrap);
}

module.exports = {
    defer: defer,
    allSettled: allSettled,
    fcall: fcall
}