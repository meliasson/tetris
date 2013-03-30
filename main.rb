require "sinatra"
require "haml"

get "/" do
  haml :index
end

not_found do
  haml :error404
end
