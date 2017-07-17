CREATE PROCEDURE [dbo].[aircraft_type_nomenclatures_sel]
(
     @aircraft_type_id int = null
	,@aircraft_type_nomenclature_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON
  IF isnull(@aircraft_type_id,0) <> 0
     SELECT * FROM dbo.aircraft_type_nomenclatures_v WHERE aircraft_type_id = @aircraft_type_id and isnull(aircraft_type_nomenclature_pid,0)=0
  else
    SELECT * FROM dbo.aircraft_type_nomenclatures_v WHERE aircraft_type_nomenclature_pid = @aircraft_type_nomenclature_id 
END


