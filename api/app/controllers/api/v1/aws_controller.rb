AWS_ACCESS_KEY = ENV["AWS_ACCESS_KEY"]
AWS_SECRET = ENV["AWS_SECRET"]
AWS_REGION="ap-northeast-1"
S3BUCKET="sql-analysis-bucket-output"

module Api
  module V1
    class AwsController < ApplicationController
      def save_s3_output
        s3 = Aws::S3::Resource.new({
            access_key_id:      AWS_ACCESS_KEY,
            secret_access_key:  AWS_SECRET,
            region:             AWS_REGION,
          })
        bucket = s3.bucket(S3BUCKET)

        # methods
        methods_output = bucket.objects(prefix: "methods/part-")
        methods_output.each do |object|
          rows = object.get.body.read.split(/\R/)
          rows.each do |r|
            row = r.split(",")
            save_methods_output(row)
          end
        end

        # conditions
        conditions_output = bucket.objects(prefix: "conditions/part-")
        conditions_output.each do |object|
          rows = object.get.body.read.split(/\R/)
          rows.each do |r|
            row = r.split(",")
            save_conditions_output(row)
          end
        end

        # tables
        tables_output = bucket.objects(prefix: "tables/part-")
        tables_output.each do |object|
          rows = object.get.body.read.split(/\R/)
          rows.each do |r|
            row = r.split(",")
            save_tables_output(row)
          end
        end


        render json: { error: nil, data: nil }
      end

      # e.g. row = [books,insert,3]
      private def save_methods_output(row)
        return if row.length != 3
        table_name = row[0]
        method = row[1]
        count = row[2].to_i
        update_method_count(table_name, method, count)
      end

      private def update_method_count(table_name, method, count)
        count_int = count.to_i
        table = Table.find_by(name: table_name)
        return if table.nil?

        case method
        when "select"
          table.update("select_count" => table.select_count + count_int)
        when "insert"
          table.update("insert_count" => table.insert_count + count_int)
        when "update"
          table.update("update_count" => table.update_count + count_int)
        when "delete"
          table.update("delete_count" => table.delete_count + count_int)
        end
      end

      # e.g. row = [users,age,3]
      private def save_conditions_output(row)
        return if row.length != 3
        table_name = row[0]
        column_name = row[1]
        count = row[2].to_i
        table = Table.find_by(name: table_name)
        return if table.nil?
        column = table.columns.find_by(name: column_name)
        return if column.nil?
        column.update(access_num: column.access_num + count)
      end

      # e.g. row = [users,tables,1]
      private def save_tables_output(row)
        return if row.length != 3
        main_table_name = row[0]
        joined_table_name = row[1]
        count = row[2].to_i
        main_table = Table.find_by(name: main_table_name)
        return if main_table.nil?
        joined_table = Table.find_by(name: joined_table_name)
        return if joined_table.nil?
        joined_table_entity = JoinedTable.find_by(main_table_id: main_table.id, joined_table_id: joined_table.id)
        if joined_table_entity.nil?
          JoinedTable.create(main_table_id: main_table.id, joined_table_id: joined_table.id, count: count)
        else
          joined_table_entity.update(count: joined_table_entity.count + count)
        end
      end

    end
  end
end
