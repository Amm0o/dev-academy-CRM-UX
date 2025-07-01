# Install NVM for node version management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Load NVM
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# Install latest version at the moment since I'm fancy :) 
nvm install v24.2.0

# Now create the react project
# npx create-react-app crm-frontend --template typescript
sleep 2

echo "restart your shell to have access to node, run: node --version to confirm"