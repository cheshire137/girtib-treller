# encoding=utf-8
require 'sinatra'
require 'json'
require 'securerandom'
require 'net/http'
require 'logger'

enable :sessions, :logging
set :session_secret, ENV['SESSION_KEY']

before do
  logger.level = Logger::DEBUG
end

if ENV['RACK_ENV'] == 'production'
  set :public_folder, 'dist'
else
  set :public_folder, 'app'
end

use Rack::Static, urls: ['/styles', '/scripts/**/*.js', '/images',
                         '/bower_components'], root: settings.public_folder

# For Heroku
get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

# For Heroku where the API URL and front end URL are the same
get '/scripts/config.json' do
  content_type 'application/json'
  {localStorageKey: 'girtib-treller', apiUrl: ENV['FRONT_END_URL'],
   https: ENV['RACK_ENV'] == 'production'}.to_json
end

get '/auth/github' do
  content_type :json
  session[:state] = SecureRandom.hex
  scopes = 'repo'
  if ENV['RACK_ENV'] == 'production'
    redirect_url = ENV['FRONT_END_URL']
  else
    redirect_url = "#{request.scheme}://#{request.host}"
    redirect_url += ":#{request.port}" unless request.port == 80
  end
  redirect_url += '/auth/github/callback'
  github_url = 'https://github.com/login/oauth/authorize?client_id=' +
               ENV['GITHUB_CLIENT_ID'] + '&redirect_uri=' + redirect_url +
               '&scope=' + scopes + '&state=' + session[:state]
  redirect github_url
end

get '/auth/github/callback' do
  content_type :json
  code = params[:code]
  unless params[:state] == session[:state]
    status 424 # failed dependency
    return {error: 'Invalid state, could not authenticate with Github.'}.to_json
  end
  session[:state] = nil
  uri = URI('https://github.com/login/oauth/access_token')
  data = {'client_id' => ENV['GITHUB_CLIENT_ID'],
          'client_secret' => ENV['GITHUB_CLIENT_SECRET'],
          'code' => code}
  https = Net::HTTP.new(uri.host, uri.port)
  https.use_ssl = true
  https.verify_mode = OpenSSL::SSL::VERIFY_PEER
  req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
  req['Accept'] = 'application/json'
  req.set_form_data data
  res = https.request(req)
  if res.is_a? Net::HTTPSuccess
    token = JSON.parse(res.body)['access_token']
    redirect "#{ENV['FRONT_END_URL']}/#/auth/#{token}"
  else
    redirect "#{ENV['FRONT_END_URL']}/#/failed-auth"
  end
end
