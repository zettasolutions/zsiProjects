


CREATE FUNCTION [dbo].[getAircraftTypeNomenclatureId] 
(
	 @aircraft_type_id AS INT
	,@item_code_id AS NVARCHAR(50)
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   varchar(50);
   SELECT @l_retval = aircraft_type_nomenclature_id FROM dbo.aircraft_type_nomenclatures
   WHERE aircraft_type_id = @aircraft_type_id and item_code_id=@item_code_id
   RETURN @l_retval;
END;


