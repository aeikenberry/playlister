FROM node:0.10.38

RUN apt-get update -qq && apt-get install -y build-essential ruby
RUN gem install sass && mkdir /src && npm install gulp -g

WORKDIR /src

EXPOSE 35729

CMD ["npm", "run", "dev"]
