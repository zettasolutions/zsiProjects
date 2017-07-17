CREATE FUNCTION [dbo].[countAircraftTypeItems] 
(
	@aircraft_type_id			as   int = null
   ,@aircraft_type_nomenclature_id as int=null
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   if isnull(@aircraft_type_nomenclature_id,0) = 0
      SELECT @l_retval = COUNT(*) FROM dbo.aircraft_type_nomenclatures WHERE aircraft_type_id = @aircraft_type_id and isnull(aircraft_type_nomenclature_pid,0)=0
   else
      SELECT @l_retval = COUNT(*) FROM dbo.aircraft_type_nomenclatures WHERE isnull(aircraft_type_nomenclature_pid,0)=@aircraft_type_nomenclature_id

   RETURN isnull(@l_retval,0);
END;




