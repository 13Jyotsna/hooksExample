'use strict';

module.exports = function(Greet) {
  // remote method
  Greet.message = function(msg, cb) {
    cb(null,msg);
    console.log(msg);
  };
  //adding the endpoint of the remote method
  Greet.remoteMethod(
    'message',
    {
      accepts: [{arg: 'message', type: 'string'}],
      returns: {arg: 'greeting', type: 'string'},
      http: {path:'/greeting', verb: 'post'}
    }
  );

//triggered before a remote method is executed or before this api is hit
  Greet.beforeRemote('message', function(context, unused, next) {
    console.log('Waiting for the greeting message');
    next();
  });

  // // afterInitialize is a model hook which is still used in loopback
  Greet.afterInitialize = function() {
    console.log('> afterInitialize triggered');
  };

  // // the rest are all operation hooks
  Greet.observe('before save', function(ctx, next) {
    console.log('> before save triggered:', ctx.Model.modelName, ctx.instance ||
      ctx.data);
    next();
  });
  Greet.observe('after save', function(ctx, next) {
    console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Greet.observe('before delete', function(ctx, next) {
    console.log('> before delete triggered:',
      ctx.Model.modelName, ctx.instance);
    next();
  });
  Greet.observe('after delete', function(ctx, next) {
    console.log('> after delete triggered:',
      ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // triggered after a remote method is excecuted or after that api is hit
Greet.afterRemote('message', function(context, remoteMethodOutput, next) {
    console.log('Greetings reached');
    next();
  });

  // model operation hook
  Greet.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      console.log('About to save a greet instance:', ctx.instance);
    } else {
      console.log('About to update greetings that match the query %j:', ctx.where);
    }
    next();
  });
};
