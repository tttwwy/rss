##**简介**
将微信公众号的订阅内容转换成RSS格式订阅，以便在RSS阅读器上查看

##**环境依赖**
 1. phantomjs
 2. selenium
 3. django
 
 phantomjs在部署的时候，可能会遇到问题，下面是我使用的部署方法。

 1. phantomjs 

    ```sh
    cd /usr/local/share
    sudo wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.7-linux-x86_64.tar.bz2
    sudo tar xjf phantomjs-1.9.7-linux-x86_64.tar.bz2
    sudo ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/share/phantomjs
    sudo ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs
    sudo ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/bin/phantomjs
    ```

    ```
