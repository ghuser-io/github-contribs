set -e

rm -rf octicons/
curl -o octicons.tgz https://registry.npmjs.org/octicons/-/octicons-7.3.0.tgz
tar xvzf octicons.tgz
rm octicons.tgz
mv package/build/svg/ octicons/
rm -rf package/
