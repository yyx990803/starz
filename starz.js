#!/usr/bin/env node
var c     = require('colors'),
    https = require('https'),
    opts  = require('optimist')
        .usage('Count a GitHub user\'s total stars.')
        .demand(1)
        .alias('t', 'thresh')
        .alias('l', 'limit')
        .alias('a', 'auth')
        .default('t', 1)
        .default('l', Infinity)
        .describe({
            'a': 'GitHub username:password for rate limits',
            't': 'Only show repos above this threshold',
            'l': 'Only show this many repos'
        })
        .argv,
    user = opts._[0]

request('/users/' + user, function (res) {
    if (!res.public_repos) {
        console.log(res.message)
        return
    }
    var pages = Math.ceil(res.public_repos / 100),
        i = pages,
        repos = []
    while (i--) {
        request('/users/' + user + '/repos?per_page=100&page=' + (i + 1), check)
    }
    function check (res) {
        repos = repos.concat(res)
        pages--
        if (!pages) output(repos)
    }
})

function request (url, cb) {
    var reqOpts = {
        hostname: 'api.github.com',
        path: url,
        headers: {'User-Agent': 'GitHub StarCounter'},
        auth: opts.auth || undefined
    }
    https.request(reqOpts, function (res) {
        var body = ''
        res
            .on('data', function (buf) {
                body += buf.toString()
            })
            .on('end', function () {
                cb(JSON.parse(body))
            })
    }).end()
}
 
function output (repos) {
    var total = 0,
        longest = 0,
        list = repos
            .filter(function (r) {
                total += r.stargazers_count
                if (r.stargazers_count >= opts.thresh) {
                    if (r.name.length > longest) {
                        longest = r.name.length
                    }
                    return true
                }
            })
            .sort(function (a, b) {
                return b.stargazers_count - a.stargazers_count
            })

    if (list.length > opts.limit) {
        list = list.slice(0, opts.limit)
    }

    console.log('\nTotal: ' + total.toString().green + '\n')
    console.log(list.map(function (r) {
        return r.name +
            new Array(longest - r.name.length + 4).join(' ') +
            '\u2605  '.yellow +
            r.stargazers_count
    }).join('\n'))
    console.log()
}