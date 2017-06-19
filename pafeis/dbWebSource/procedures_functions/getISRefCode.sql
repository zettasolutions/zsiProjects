



CREATE FUNCTION [dbo].[getISRefCode] 
(
	@issuance_id AS INT
)
RETURNS varchar(500)
AS
BEGIN   
   DECLARE @l_retval   varchar(500);
   SELECT @l_retval = authority_ref FROM dbo.issuances where issuance_id = @issuance_id
   RETURN @l_retval;
END;



