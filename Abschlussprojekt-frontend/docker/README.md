# Docker files

## Frontend

Über das `Dockerfile` wird das Frontend »containerisiert«. Dazu wurde ein Multistage-Build
erstellt, welches zuerst die React/vite.js-App (*build*) erstellt und anschließend die App in einen nginx:alpine-Container (*prod*) kopiert.

In diesem Container läuft ngnix per default non-root:

```sh
/ # ps axu
PID   USER     TIME  COMMAND
    1 root      0:00 nginx: master process nginx -g daemon off;
   30 nginx     0:00 nginx: worker process
   31 nginx     0:00 nginx: worker process
…
```

Der Container »hört« standardmäßig auf Port 80.

### Einbindung ins Projekt

Der Container wird in einer Pipeline erstellt und von dort aus in eine Registry (ECR) gepusht.
Wenn die Auto-Scaling-Group einen neuen Host hochfährt, wird dieser mit einem eigenen AMI (bereits vorinstalliertes Docker) installiert und innerhalb des User-Scripts wird dieser Container dann auf den Host geladen und ausgeführt. Die Anbindung des Webservers erfolgt über den vorgeschalteten Load-Balancer.
