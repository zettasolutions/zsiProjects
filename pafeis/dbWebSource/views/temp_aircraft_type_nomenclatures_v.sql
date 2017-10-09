CREATE VIEW dbo.temp_aircraft_type_nomenclatures_v
AS
SELECT        user_id, aircraft_type, part_no, parent_part_no, id, dbo.getAircraftTypeId(aircraft_type) AS aircraft_type_id, dbo.getItemCodeId(part_no) AS item_code_id
FROM            dbo.temp_aircraft_type_nomenclatures
