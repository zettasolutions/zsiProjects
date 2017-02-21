
CREATE FUNCTION [dbo].[countSquadrons] 
(
	@wing_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.squadrons WHERE @wing_id = @wing_id

   RETURN @l_retval;
END;




