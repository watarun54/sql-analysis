module Api
  module V1
    class FilesController < ApplicationController
      def upload
        b64_content = params[:base64]
        decoded_content = Base64.decode64(b64_content)
        render json: { error: nil, data: decoded_content }
      end
    end
  end
end
