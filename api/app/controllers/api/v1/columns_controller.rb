module Api
  module V1
    class ColumnsController < ApplicationController
      before_action :set_column, only: [:destroy]

      def create
        begin
          column = Column.new(column_params)
          column.save!
          render json: { error: nil, data: column }
        rescue => e
          render json: { error: e.message, data: nil }
        end
      end

      def destroy
        @column.destroy
        render json: { error: nil, data: @column }
      end

      private

      def set_column
        @column = Column.find(params[:id])
      end

      def column_params
        params.require(:column).permit(:name, :table_id)
      end
    end
  end
end
