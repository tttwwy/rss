killall -9 uwsgi
python manage.py createcachetable cache_table
uwsgi -x rss.xml --daemonize uwsgi.log
