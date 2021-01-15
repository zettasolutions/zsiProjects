CREATE VIEW dbo.refuel_transactions_v
AS
SELECT        dbo.refuel_transactions.gas_station_id, dbo.refuel_transactions.refuel_id, dbo.refuel_transactions.doc_no, dbo.refuel_transactions.doc_date, dbo.refuel_transactions.vehicle_id, dbo.refuel_transactions.driver_id, 
                         dbo.refuel_transactions.odo_reading, dbo.refuel_transactions.no_liters, dbo.refuel_transactions.unit_price, dbo.refuel_transactions.refuel_amount, dbo.refuel_transactions.created_by, dbo.refuel_transactions.created_date, 
                         dbo.refuel_transactions.updated_by, dbo.refuel_transactions.updated_date, dbo.refuel_transactions.is_posted, dbo.refuel_transactions.pao_id, dbo.gas_stations.gas_station_name
FROM            dbo.refuel_transactions INNER JOIN
                         dbo.gas_stations ON dbo.refuel_transactions.gas_station_id = dbo.gas_stations.gas_station_id
