


CREATE FUNCTION [dbo].[getSquadronType] 
(
	@squadron_type_id AS INT
)
RETURNS varchar(500)
AS
BEGIN   
   DECLARE @l_retval   varchar(50);
   SELECT @l_retval = squadron_type FROM dbo.squadron_types where squadron_type_id = @squadron_type_id
   RETURN @l_retval;
END;


