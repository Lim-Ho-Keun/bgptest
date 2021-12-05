#!/usr/bin/env python3
# import external libraries
from flask import Flask, render_template, url_for, request
from flask_socketio import SocketIO, emit, disconnect
from threading import Lock
import random
import time
import psutil

# import customized library
from config import flask_config

async_mode, app, socketio, thread, thread_lock = flask_config()


# Home
@app.route('/')
def index():
    return render_template('index.html')


# Real-Time Detection
@app.route('/bgp_ad_realtime')
def bgp_ad_realtime():
    header1 = "Real-Time Detection"
    return render_template('bgp_ad_realtime.html', header1=header1,
                           async_mode=socketio.async_mode)


# Off-Line Classification
@app.route('/bgp_ad_offline')
def bgp_ad_offline():
    header2 = "Off-Line Classification"
    return render_template('bgp_ad_offline.html', header2=header2)


# Contact
@app.route('/contact')
def contact():
    return render_template('contact.html')


# Received parameters for the off-Line experiment
@app.route('/bgp_ad_offline', methods=["POST"])
def analyze_offline():
    header2 = "Off-Line Classification"
    model_choice = request.form['model_choice']
    if request.method == 'POST':
        if model_choice == 'ripe':
            result_prediction = random.randint(100, 200)
        elif model_choice == 'routeviews':
            result_prediction = random.randint(200, 300)
    return render_template('bgp_ad_offline.html',
                           result_prediction=result_prediction,
                           model_selected=model_choice, header2=header2)


@socketio.on('main_event', namespace='/test_conn')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread_cpu)


def background_thread_cpu():
    count = 0
    while True:
        # socketio.sleep(2)
        t = time.strftime('%a, %d %b %Y %H:%M:%S', time.localtime())
        t2 = random.randint(1, 100)
        socketio.emit('server_response',
                      {'data': [t, t2]}, namespace='/test_conn')

        socketio.sleep(1)
        count += 1
        t_chart = time.strftime('%H:%M:%S', time.localtime())
        cpus = psutil.cpu_percent(interval=None, percpu=True)  # percentages for each core, 10 elements
        t_chart = 10 * [t_chart]  # 10 time elements
        # cpus = sum(cpus)/len(cpus) # avg cpu %
        # generate 3 arrays, announcement, results vs. time.
        socketio.emit('server_response_echart',
                      {'data_cpu': [t_chart, cpus], 'count': count},
                      namespace='/test_conn')


if __name__ == '__main__':
    socketio.run(app, debug=True)
    # app.run(debug=True)

"""
use of app.run vs. socketio.run :

https://github.com/miguelgrinberg/Flask-SocketIO/issues/1273
Flask-SocketIO needs a web server. There are a few that you can use:
The Gevent web server, started via socketio.run()
The eventlet web server, also started via socketio.run()
The Flask dev web server, which can be started either via app.run() or for convenience also via socketio.run()
The Gunicorn web server with the eventlet or gevent workers, started via the gunicorn command.
The uwsgi web server with gevent, started via the uwsgi command.
"""
