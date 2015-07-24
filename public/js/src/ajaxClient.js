var AjaxClient = {
    API_ROOT: null,

    request: function(type, path, data) {
        return $.ajax({
            url: this.url(path),
            type: type,
            data: data,
            dataType: 'json',
            contentType: 'application/json'
        });
    },

    url: function(path) {
        return this.API_ROOT.substr(0, this.API_ROOT.length - 1) + path;
    },

    get: function(path, data) {
        return this.request('GET', path, data);
    },

    post: function(path, data) {
        return this.request('POST', path, JSON.stringify(data));
    },

    patch: function(path, data) {
        return this.request('PATCH', path, JSON.stringify(data));
    },

    put: function(path, data) {
        return this.request('PUT', path, JSON.stringify(data));
    },

    delete: function(path) {
        return this.request('DELETE', path);
    }
};

module.exports = AjaxClient;
