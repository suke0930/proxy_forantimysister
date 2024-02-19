# Ubuntuのベースイメージを使用
FROM ubuntu:latest
# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y squid vim procps tini
ARG USERNAME=proxy2
ARG GROUPNAME=proxy2
ARG UID=1090
ARG GID=1090
RUN groupadd -g $GID $GROUPNAME && \
    useradd -m -s /bin/bash -u $UID -g $GID $USERNAME
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y tzdata 
# RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
USER $USERNAME
WORKDIR /home/$USERNAME/
RUN touch sq.pid
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["squid","-N"]
#ENTRYPOINT ["tail", "-F", "/dev/null"] 