killall -9 uwsgi
uwsgi -x django.xml --daemonize django.log
