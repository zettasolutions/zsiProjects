CREATE VIEW dbo.items_on_aircraft_serials_v
AS
SELECT        dbo.items.item_id, dbo.items.serial_no, dbo.items.manufacturer_id, dbo.getManufacturerName(dbo.items.manufacturer_id) AS manufacturer_name, dbo.items.dealer_id, dbo.getDealerName(dbo.items.dealer_id) 
                         AS dealer_name, dbo.items.supply_source_id, dbo.getSupplySourceName(dbo.items.supply_source_id) AS supply_source_name, dbo.items.time_since_new, dbo.items.time_before_overhaul, 
                         dbo.items.time_since_overhaul, dbo.items.remaining_time, dbo.items.date_delivered, dbo.items.aircraft_info_id, dbo.items.date_issued, dbo.items.status_id, dbo.item_codes_v.part_no, 
                         dbo.item_codes_v.national_stock_no, dbo.item_codes_v.item_code, dbo.item_codes_v.item_name, dbo.item_codes_v.item_type_name, dbo.item_codes_v.monitoring_type_id, 
                         dbo.item_codes_v.unit_of_measure, dbo.item_codes_v.parent_item_type_id, dbo.item_codes_v.item_cat_code, dbo.item_codes_v.unit_of_measure_id, dbo.item_codes_v.critical_level, 
                         dbo.items.item_code_id
FROM            dbo.items INNER JOIN
                         dbo.item_codes_v ON dbo.items.item_code_id = dbo.item_codes_v.item_code_id
WHERE        (ISNULL(dbo.items.aircraft_info_id, 0) <> 0)
