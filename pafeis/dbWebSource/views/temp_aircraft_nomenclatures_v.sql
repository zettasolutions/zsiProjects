CREATE VIEW dbo.temp_aircraft_nomenclatures_v
AS
SELECT        dbo.getAircraftId(aircraft_code) AS aircraft_id, dbo.getItemCodeId(part_no) AS item_code_id, serial_no, dbo.getManufacturerId(manufacturer) AS manufacturer_id, dbo.getDealerId(dealer) AS dealer_id, 
                         dbo.getSupplySourceId(supply_source) AS supply_source_id, remaining_time, date_issued, dbo.getItemClassId(item_class) AS item_class_id, dbo.getStatusId(status) AS status_id, user_id, id
FROM            dbo.temp_aircraft_nomenclatures
