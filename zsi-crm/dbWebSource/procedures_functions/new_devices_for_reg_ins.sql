CREATE PROCEDURE dbo.new_devices_for_reg_ins(
   @client_id int
  ,@no_devices int
)
AS
BEGIN
   DECLARE @ctr int = 0
   WHILE @ctr < @no_devices
   BEGIN
      INSERT INTO zsi_afcs.dbo.devices (company_id, hash_key, is_active) values (@client_id,newid(),'N')
	  SET @ctr = @ctr + 1;
   END
END