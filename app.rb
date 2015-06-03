# encoding=utf-8
require 'sinatra'
require 'json'
require 'securerandom'
require 'net/http'

enable :sessions, :logging
set :session_secret, ENV['SESSION_KEY']

get '/auth/github' do
  content_type :json
  session[:state] = SecureRandom.hex
  scopes = 'repo:status'
  redirect_url = "#{request.scheme}://#{request.host}"
  redirect_url += ":#{request.port}" unless request.port == 80
  redirect_url += '/auth/github/callback'
  github_url = 'https://github.com/login/oauth/authorize?client_id=' +
               ENV['GITHUB_CLIENT_ID'] + '&redirect_uri=' + redirect_url +
               '&scope=' + scopes + '&state=' + session[:state]
  redirect github_url
end

get '/auth/github/callback' do
  content_type :json
  code = params[:code]
  state = params[:state]
  unless state == session[:state]
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
