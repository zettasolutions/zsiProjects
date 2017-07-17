CREATE VIEW dbo.items_v
AS
SELECT        item_id, serial_no, manufacturer_id, dbo.getManufacturerName(manufacturer_id) AS manufacturer_name, dealer_id, dbo.getDealerName(dealer_id) AS dealer_name, supply_source_id, 
                         dbo.getSupplySourceName(supply_source_id) AS supply_source_name, time_since_new, time_before_overhaul, time_since_overhaul, remaining_time, date_delivered, aircraft_info_id, date_issued, status_id, no_repairs, 
                         no_overhauls, item_inv_id, parent_item_id, dbo.getStatus(status_id) AS item_status, item_code_id, dbo.getMonitoringTypeByItemCodeId(item_code_id) AS monitoring_type
FROM            dbo.items
WHERE        (status_id <> 15) AND (ISNULL(aircraft_info_id, 0) = 0)
