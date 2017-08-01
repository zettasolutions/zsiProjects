
CREATE VIEW [dbo].[temp_aircraft_type_nomenclatures_v]
AS
SELECT        dbo.temp_aircraft_type_nomenclatures.*, dbo.getAircraftTypeId(aircraft_type) AS aircraft_type_id, dbo.getItemCodeId(part_no) AS item_code_id
FROM            dbo.temp_aircraft_type_nomenclatures

