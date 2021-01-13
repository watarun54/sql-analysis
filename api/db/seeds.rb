# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

@user_table = Table.create(name: "users", select_count: 3000, insert_count: 1500, update_count: 2000, delete_count: 1000)
@book_table = Table.create(name: "books", select_count: 3000, insert_count: 1500, update_count: 2000, delete_count: 1000)
@articles_table = Table.create(name: "articles", select_count: 3000, insert_count: 1500, update_count: 2000, delete_count: 1000)
@reservations_table = Table.create(name: "reservations", select_count: 3000, insert_count: 1500, update_count: 2000, delete_count: 1000)

@user_table.columns.create(name: "id", access_num: 1000)
@user_table.columns.create(name: "name", access_num: 2000)
@user_table.columns.create(name: "age", access_num: 3000)

@book_table.columns.create(name: "id", access_num: 1000)
@book_table.columns.create(name: "title", access_num: 2000)
@book_table.columns.create(name: "published_at", access_num: 3000)

@articles_table.columns.create(name: "id", access_num: 1000)
@articles_table.columns.create(name: "title", access_num: 2000)
@articles_table.columns.create(name: "description", access_num: 3000)

@reservations_table.columns.create(name: "id", access_num: 1000)
@reservations_table.columns.create(name: "user_id", access_num: 2000)
@reservations_table.columns.create(name: "book_id", access_num: 3000)

@user_table.joined_tables.create(joined_table_id: @book_table.id, count: 2000)
@user_table.joined_tables.create(joined_table_id: @articles_table.id, count: 3000)
@user_table.joined_tables.create(joined_table_id: @reservations_table.id, count: 1500)
