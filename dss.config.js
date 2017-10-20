module.exports = {
    docs: {
        files: {
            'dist/': 'src/less/components/*.less'
        },
        options: {
            template: 'src/dss/',
            parsers: {
                link: function(i, line, block){
                    var exp = new RegExp('(b(https?|ftp|file)://[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])', 'ig');
                    line.replace(exp, '<a href="$1">$1</a>');
                    return line;
                },
                lvar: function(i, line, block) {
                    var lvar = line.split(' - ');

                    return {
                        name:        lvar[0] ? lvar[0] : '',
                        defaults:    lvar[1] ? lvar[1] : '',
                        description: lvar[2] ? lvar[2] : ''
                    };
                },
                see: function(i, line, block) {
                    return line;
                },
                depends: function(i, line, block) {
                    return {
                        depends: line
                    };
                },
                requires: function(i, line, block) {
                    return {
                        requires: line
                    };
                },
                method: function(i, line, block) {
                    var method = line.split(' - ');

                    return {
                        name:        method[0] ? method[0] : '',
                        description: method[1] ? method[1] : ''
                    };
                },
                component: function(i, line,block) {
                    return line;
                }
            }
        }
    }
};

