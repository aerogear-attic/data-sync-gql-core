set -x

# some variables
repo_name=$REPO_NAME
package_name=@aerogear/data-sync-gql-core
dir="$(cd "$(dirname "$0")" && pwd)"
repo=$dir/../

if [ -n $CI ]
then
  sudo npm link
else
  npm link
fi

mkdir $repo/data-sync-repos
cd $repo/data-sync-repos

# clone the repo, npm install and npm link the core module
git clone git@github.com:aerogear/$repo_name
cd $repo/data-sync-repos/$repo_name
npm install

if [ -n $CI ]
then
  sudo npm link $package_name
else
  npm link $package_name
fi