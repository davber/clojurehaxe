var global = this; // required by React

var nashorn_load = function(path) {
    var outputPath = (typeof CLJS_OUTPUT_DIR != "undefined" ? CLJS_OUTPUT_DIR : ".") + java.io.File.separator + path;
    if (typeof CLJS_DEBUG != "undefined" && CLJS_DEBUG) print("loading:" + outputPath);
    load(outputPath);
};

goog.global.CLOSURE_IMPORT_SCRIPT = function(path) {
    nashorn_load("goog/" + path);
    return true;
};

goog.global.isProvided_ = function(name) { return false; };

var __executorService = Java.type("java.util.concurrent.Executors").newScheduledThreadPool(0);
__executorService.setMaximumPoolSize(1);
var __millis = Java.type("java.util.concurrent.TimeUnit").valueOf("MILLISECONDS");

var nashorn_tear_down = function() {
    __executorService.shutdown();
}

function setTimerRequest(handler, delay, interval, args) {
    handler = handler || function() {};
    delay = delay || 0;
    interval = interval || 0;
    var applyHandler = function() { handler.apply(this, args); }
    if (interval > 0) {
        return __executorService.scheduleWithFixedDelay(applyHandler, delay, interval, __millis);
    } else {
        return __executorService["schedule(java.lang.Runnable, long, java.util.concurrent.TimeUnit)"](applyHandler, delay, __millis);
    };
}

function clearTimerRequest(future) {
    future.cancel(false);
}

function setInterval() {
    var args = Array.prototype.slice.call(arguments);
    var handler = args.shift();
    var ms = args.shift();
    return setTimerRequest(handler, ms, ms, args);
}

function clearInterval(future) {
    clearTimerRequest(future);
}

function setTimeout() {
    var args = Array.prototype.slice.call(arguments);
    var handler = args.shift();
    var ms = args.shift();

    return setTimerRequest(handler, ms, 0, args);
}

function clearTimeout(future) {
    clearTimerRequest(future);
}

function setImmediate() {
    var args = Array.prototype.slice.call(arguments);
    var handler = args.shift();

    return setTimerRequest(handler, 0, 0, args);
}

function clearImmediate(future) {
    clearTimerRequest(future);
}
