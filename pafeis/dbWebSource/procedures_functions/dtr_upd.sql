
create PROCEDURE [dbo].[dtr_upd]
(
    @loginType char(1)
   ,@user_id int
)
AS

BEGIN
SET NOCOUNT ON
-- Update Process
DECLARE @countIn int = 0;

	DECLARE @dtr_id int = 0;
	IF @loginType = 'O'
		BEGIN
			select top  1 @dtr_id = isnull(dtr_id,0) from dbo.dtr  
			where	
					time_out IS NULL
				AND employee_id = @user_id
				AND datediff(day,time_in, SYSDATETIME()) in (0,1)
			order by dtr_id desc

			if(@dtr_id <> 0) UPDATE dbo.dtr set time_out = GETDATE() WHERE dtr_id = @dtr_id 
		END

-- Insert Process

	DECLARE @isInExist char(1)='N';
	IF @loginType = 'I'
		BEGIN
			IF @isInExist = (SELECT IIF(COUNT(employee_id)=0 , 'N', 'Y' ) as employee_id
							 FROM dbo.dtr
							 WHERE EXISTS(SELECT employee_id FROM dbo.dtr WHERE employee_id = @user_id
					     				  AND CONVERT(VARCHAR(10), time_in, 111) = CONVERT(VARCHAR(10), SYSDATETIME(), 111))) 
				INSERT INTO dtr(
					 employee_id	
					,time_in	
					)

				SELECT 
					 @user_id
					,GETDATE()	
		END
		
END

