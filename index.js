const core = require('@actions/core')
const exec = require('child_process').exec
const fs = require('fs')

try {
  installSFDX()
} catch (error) {
  core.setFailed(error.message)
}

function installSFDX(){
  var download = 'wget https://developer.salesforce.com/media/salesforce-cli/sfdx/channels/stable/sfdx-linux-x64.tar.xz -q -P /tmp'
  var createDir = 'mkdir /tmp/sfdx'
  var unzip = 'tar xJf /tmp/sfdx-linux-x64.tar.xz -C /tmp/sfdx --strip-components 1'
  var install = 'echo "/tmp/sfdx/bin" >> $GITHUB_PATH'
  var version = '/tmp/sfdx/bin/sfdx --version && /tmp/sfdx/bin/sfdx plugins --core'
  exec(download+' && '+createDir+' && '+unzip+' && '+install+' && '+version, function(error, stdout, stderr){
    if(error) throw(stderr)
    core.info(stdout)
    if(core.getInput('sfdx-auth-url')) createAuthFile()
  })
}

function createAuthFile(){
  fs.writeFileSync('/tmp/sfdx_auth.txt', core.getInput('sfdx-auth-url'))
  authSFDX()
}

function authSFDX(){
  var params = '--setdefaultdevhubusername --setdefaultusername -a SFDX-ENV'
  exec('/tmp/sfdx/bin/sfdx auth:sfdxurl:store -f /tmp/sfdx_auth.txt '+params, function(error, stdout, stderr){
    if(error) throw(stderr)
	core.info(stdout)
  })
}

