

CREATE PROCEDURE [dbo].[mission_symbols_upd]
(
    @tt    mission_symbols_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  ms_code				= b.ms_code
		,ms_description			= b.ms_description
		,ms_classification_code = b.ms_classification_code
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.mission_symbols a INNER JOIN @tt b
    ON a.ms_id = b.ms_id
    WHERE isnull(b.is_edited,'N') = 'Y'
	   
-- Insert Process
    INSERT INTO dbo.mission_symbols (
         ms_code
		,ms_description
		,ms_classification_code
        ,created_by
        ,created_date
        )
    SELECT 
        ms_code	
	   ,ms_description
	   ,ms_classification_code
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE ms_id IS NULL
	AND ms_code IS NOT NULL;
END




