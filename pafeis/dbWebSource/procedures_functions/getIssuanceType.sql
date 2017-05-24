CREATE FUNCTION [dbo].[getIssuanceType](
  @issuance_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_value VARCHAR(100); 
      SELECT @l_value = issuance_type FROM dbo.issuances where issuance_id = @issuance_id
      RETURN @l_value;
END;


