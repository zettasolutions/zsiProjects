
CREATE PROCEDURE [dbo].[image_file_issuances_upd](
        @issuance_id	INT
       ,@img_filename	VARCHAR(200)

)
AS 
BEGIN
 SET NOCOUNT ON
 update dbo.issuances
	set img_filename=@img_filename
	    where issuance_id = @issuance_id

END 
