module Api
  module V1
    class TablesController < ApplicationController
      before_action :set_table, only: [:show, :destroy]

      def index
        tables = Table.order(created_at: :asc)
        render json: { error: nil, data: tables }
      end

      def show
        render json: { error: nil, data: @table }
      end

      def create
        begin
          table = Table.new(table_params)
          table.save!
          render json: { error: nil, data: table }
        rescue => e
          render json: { error: e.message, data: nil }
        end
      end

      def destroy
        @table.destroy
        render json: { error: nil, data: @table }
      end

      def columns
        @table = Table.find(params[:table_id])
        render json: { error: nil, data: @table.columns }
      end

      def joined_tables
        @table = Table.find(params[:table_id])
        res_data = @table.joined_tables.order(count: :desc).map do |jt|
          {
            id: jt.id,
            joined_table_name: Table.find(jt.joined_table_id).name,
            count: jt.count,
          }
        end
        render json: { error: nil, data: res_data }
      end

      private

      def set_table
        @table = Table.find(params[:id])
      end

      def table_params
        params.require(:table).permit(:name)
      end
    end
  end
end
