FROM alpine:3.9
RUN apk update && apk add gettext

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "sh", "/entrypoint.sh" ]