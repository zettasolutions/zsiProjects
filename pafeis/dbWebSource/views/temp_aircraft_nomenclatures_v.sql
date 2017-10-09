
CREATE VIEW [dbo].[temp_aircraft_nomenclatures_v]
AS
SELECT        dbo.getAircraftId(aircraft_code) AS aircraft_id, dbo.getItemCodeId(part_no) AS item_code_id, serial_no, 
dbo.getManufacturerId(manufacturer) AS manufacturer_id, remaining_time, dbo.getStatusId(status) AS status_id, user_id, id
FROM            dbo.temp_aircraft_nomenclatures

