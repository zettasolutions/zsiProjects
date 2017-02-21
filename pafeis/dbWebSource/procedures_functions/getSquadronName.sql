


CREATE FUNCTION [dbo].[getSquadronName] 
(
	@squadron_id AS INT
)
RETURNS varchar(500)
AS
BEGIN   
   DECLARE @l_retval   varchar(500);
   SELECT @l_retval = squadron_name FROM dbo.squadrons where squadron_id = @squadron_id
   RETURN @l_retval;
END;


