Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace 'api' do
    namespace 'v1' do
      resources :tables do
        get 'columns'
        get 'joined_tables'
      end

      resources :columns, only: [:create, :destroy]

      post 'files/upload' => 'files/upload'

      get 'aws/save_s3_output' => 'aws/save_s3_output'
    end
  end
end
