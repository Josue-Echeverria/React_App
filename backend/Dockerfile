FROM mcr.microsoft.com/mssql/server:2019-latest

# Create app directory
WORKDIR /usr/src/app

# Copy initialization scripts
COPY . /usr/src/app

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=L0tsoffun!

USER root
CMD /bin/bash ./entrypoint.sh