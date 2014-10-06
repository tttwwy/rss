##**简介**
将微信公众号的订阅内容转换成RSS格式订阅，以便在RSS阅读器上查看

##**环境依赖**
 1. phantomjs 

    ```sh
    cd /usr/local/share
    sudo wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.7-linux-x86_64.tar.bz2
    sudo tar xjf phantomjs-1.9.7-linux-x86_64.tar.bz2
    sudo ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/share/phantomjs
    sudo ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs
    sudo ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/bin/phantomjs
    ```

 2. selenium

    ```sh
    sudo pip install -U selenium
    ```
 3. Django

    ```sh
    sudo pip install -U django
    ```

 4. pip
     4.1
     ```sh
     wget https://bootstrap.pypa.io/get-pip.py
     python get-pip.py
     ```
     4.2
     ```sh
     sudo apt-get install python-pip
     ```

 5.uwsgi
    ```sh
    sudo apt-get install libxml2-dev python-dev
    sudo pip install uwsgi
    ```
    uwsgi.xml
    记得去掉
    ```xml
    <plugins>python</plugins>
    ```
     
    ```xml
    <uwsgi>                       
    <socket>127.0.0.1:8631</socket>
    <chdir>./</chdir>
    <pythonpath>./rss/</pythonpath>
    <module>wsgi</module>
    </uwsgi>
    ```

 6.nginx
    ```shell
    sudo apt-get remove apache2
    sudo apt-get install nginx
    sudo vi /etc/nginx/sites-enabled/default
    ```
    
    ```php
    location /rss/ {
        uwsgi_pass 127.0.0.1:8631;
         include uwsgi_params;
     }
    ```

